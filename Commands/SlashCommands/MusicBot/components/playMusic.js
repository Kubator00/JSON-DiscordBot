const ytdl = require('ytdl-core');
const queue = require('./queueMap');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');
module.exports.play_music = play_music;
async function play_music(msg) {
    const songQueue = queue.get(msg.guild.id);
    try {
        if (songQueue.songs.length == 0)
            return;
    }
    catch {
        return msg.channel.send("Błąd odtwarzacza");
    }


    const stream = ytdl(songQueue.songs[0].url, { filter: 'audioonly', highWaterMark: 33554432 })
        .on('error', error => {
            console.log(error);
            play_music(msg);
        });

    queue.get(msg.guild.id).stream = stream;


    const resource = createAudioResource(stream, { seek: 0, volume: 1 });
    let player;
    if (!queue.get(msg.guild.id).player) {
        console.log(`New AudioPlayer: ${msg.guild.name}`);
        player = createAudioPlayer();
        queue.get(msg.guild.id).player = player;
    }
    else
        player = queue.get(msg.guild.id).player;

    try {
        player.play(resource);
        const subscription = queue.get(msg.guild.id).connection.subscribe(player);
        player.on('error', error => {
            console.log(error);
            queue.get(msg.guild.id).player.removeAllListeners();
            stream.destroy();
            play_music(msg);
        })

        player.on(AudioPlayerStatus.Idle, () => {
            songQueue.songs.shift();
            queue.get(msg.guild.id).player.removeAllListeners();
            stream.destroy();
            play_music(msg)
        });

    }
    catch (err) {
        console.log(`Blad odtwarzacza, ${err}`);
        msg.channel.send("Błąd odtwarzacza");
    }
}