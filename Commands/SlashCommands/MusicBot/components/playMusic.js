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
    let resource;
    let player;
    if (!queue.get(msg.guild.id).player) {
        player = createAudioPlayer();
        queue.get(msg.guild.id).player = player;
        resource = createAudioResource(stream, { seek: 0, volume: 1 });
        queue.get(msg.guild.id).resource = resource;
    }
    else {
        player = queue.get(msg.guild.id).player;
        resource = createAudioResource(stream, { seek: 0, volume: 1 });
    }

    try {
        player.play(resource);
        queue.get(msg.guild.id).connection.subscribe(player);
        player.on('error', error => {
            console.log(error);
            play_music(msg);

        })
        player.on(AudioPlayerStatus.Idle, () => songQueue.songs.shift());
        player.on(AudioPlayerStatus.Idle, () => play_music(msg));

    }
    catch (err) {
        console.log(`Blad odtwarzacza, ${err}`);
        // msg.channel.send("Błąd odtwarzacza");
    }
}