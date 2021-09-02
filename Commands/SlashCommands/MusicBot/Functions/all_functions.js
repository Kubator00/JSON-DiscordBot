const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnection,
} = require('@discordjs/voice');

const queue = new Map();
module.exports.queue = queue;



module.exports.find_music = find_music;
async function find_music(msg, url) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
        await msg.followUp("Musisz być na kanale głosowym aby usunąć piosenkę!");
        return;
    }

    if (ytdl.validateURL(url)) {
        const musicInfo = await ytdl.getInfo(url);
        const musicDetails = { title: musicInfo.videoDetails.title, url: musicInfo.videoDetails.video_url };
        return musicDetails;
    }

    else {
        const musicList = await ytsr(url, { limit: 1 });
        if (musicList.items.length >= 1) {
            const musicDetails = { title: musicList.items[0].title, url: musicList.items[0].url };
            return musicDetails;
        }
    }

    msg.followUp("Nie znaleziono piosenki");

    return;

}

module.exports.add_to_queue = add_to_queue;
async function add_to_queue(msg, music, addPlaylist) {
    const songQueue = queue.get(msg.guild.id);
    try {
        if (songQueue.songs.length > 50) {
            msg.channel.send("Kolejka zawiera zbyt dużą liczbę piosenek\nSpróbuj ponownie później");
            return -1;
        }
    }
    catch { }

    voiceChannel = get_voice_connect(msg)
    if (!voiceChannel)
        return;


    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) {
        const queueConstructor = {
            voiceChannel: msg.member.voice.channel,
            textChannel: msg.channel,
            connection: null,
            songs: [],
            player: null,
            resource: null

        }
        queue.set(msg.guild.id, queueConstructor);
        queueConstructor.songs.push(music);

        connection = joinVoiceChannel(voiceChannel);
        queue.get(msg.guild.id).connection = connection;
        play_music(msg);
        setTimeout(() => auto_leave(msg), 5000);
    }
    else {

        serverQueue.songs.push(music);
        if (addPlaylist == false)
            msg.followUp(`Dodano do kolejki: ${music.title}`);

        if (songQueue.songs.length == 1) {
            await play_music(msg);
        }
        return;
    }

}

module.exports.play_music = play_music;
async function play_music(msg) {

    const songQueue = queue.get(msg.guild.id);
    try {
        if (songQueue.songs.length == 0) {
            return;
        }
    }
    catch {
        msg.channel.send("Błąd odtwarzacza");
        return;
    }


    const stream = ytdl(songQueue.songs[0].url, { filter: 'audioonly', highWaterMark: 33554432 });
    const resource = createAudioResource(stream, { seek: 0, volume: 1 });
    const player = createAudioPlayer();

    queue.get(msg.guild.id).player = player;
    queue.get(msg.guild.id).resource = resource;

    try {
        player.play(resource);
        connection.subscribe(player);
        try{
        msg.followUp(`Teraz gramy: ${songQueue.songs[0].title}`);
        }
        catch{
            console.log("Blad wyslania wiadomosci - Bot Music.")
        }

        player.on('error', error => {
            play_music(msg)
            console.log(error);
        })
        player.on(AudioPlayerStatus.Idle, () => songQueue.songs.shift());
        player.on(AudioPlayerStatus.Idle, () => play_music(msg));

    }
    catch
    {
        console.log("BLAD");
        // msg.channel.send("Błąd odtwarzacza");
    }

}


function auto_leave(msg) {
    // console.log("Auto leave active");
    try {
        const server = queue.get(msg.guild.id);
        if (!server) {
            return;
        }
        const voiceChannel = queue.get(msg.guild.id).voiceChannel;
        if (voiceChannel.members.size == 1) {
            const conn = queue.get(msg.guild.id).connection;
            conn.destroy();
            queue.delete(msg.guild.id);
            return;
        }
        else
            setTimeout(() => auto_leave(msg), 60000);
    }
    catch
    {
        console.log("BŁĄD WYJŚĆIA");
    }

}

function get_voice_connect(msg) {

    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
        msg.reply("Musisz znajdować sie na kanale głosowym!");

        return
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) return msg.channel.send(`Nie mam uprawnień`);
    if (!permissions.has('SPEAK')) return msg.channel.send(`Nie mam uprawnień`);


    const connection = {
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    };

    return connection
}

module.exports.find_playlist = find_playlist;
async function find_playlist(msg, url) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
        await msg.followUp("Musisz być na kanale głosowym aby usunąć piosenkę!");
        return;
    }

    if (ytpl.validateID(url)) {
        const musicList = await ytpl(url, { pages: 1 });
        let result = [];
        for (music of musicList.items) {
            let musicInfo = {
                title: music.title,
                url: music.url
            };
            result.push(musicInfo);
        }
        return result;
    }
    else {
        msg.followUp("Nie znaleziono playlisty");
        return;
    }
}
module.exports.display_queue = display_queue;
function display_queue(msg) {
    if (!queue.get(msg.guild.id)) {
        msg.followUp("Brak następnych piosenek");
        return;
    }
    const songQueue = queue.get(msg.guild.id).songs;
    let num = 0;
    let result = ""
    if (songQueue.length == 0) {
        msg.followUp("Brak następnych piosenek");
        return;
    }
    result += `Teraz gramy:  ${songQueue[0].title} \n`;
    num += 1;
    if (songQueue.length > 1) {
        result += `NASTĘPNIE: \n`;
        let i = 0;
        for (song of songQueue) {
            if (i == 0) { i += 1; continue; }
            if (num % 20 == 0) {
                msg.followUp(result);
                result = ""
            }
            result += `${num}. ${song.title}\n`
            num += 1;
        }
    }
    if (num % 20 != 0)
        msg.followUp(result);

    return;
}