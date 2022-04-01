const ytdl = require('ytdl-core');
const queue = require('./queueMap');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');
module.exports.play_music = play_music;
const embedPlayer = require('./embedPlayer');
async function play_music(guildId) {
    const songQueue = queue.get(guildId);
    try {
        if (songQueue.songs.length == 0) {
            await embedPlayer(guildId);
            return;
        }
    }
    catch(err) {await embedPlayer(guildId); return;}


    const stream = ytdl(songQueue.songs[0].url, { filter: 'audioonly', highWaterMark: 33554432 })
        .on('error', error => {
            console.log(error);
            play_music(guildId);
        });

    queue.get(guildId).stream = stream;


    const resource = createAudioResource(stream, { seek: 0, volume: 1 });
    let player;
    if (!queue.get(guildId).player) {
        player = createAudioPlayer();
        queue.get(guildId).player = player;
    }
    else
        player = queue.get(guildId).player;

    await embedPlayer(guildId);

    try {
        player.play(resource);
        queue.get(guildId).connection.subscribe(player);
        player.on('error', error => {
            console.log(error);
            queue.get(guildId).player.removeAllListeners();
            stream.destroy();
            play_music(guildId);
        })

        player.on(AudioPlayerStatus.Idle, () => {
            songQueue.songs.shift();
            queue.get(guildId).player.removeAllListeners();
            stream.destroy();
            play_music(guildId)
        });
    }
    catch (err) {
        console.log(`Blad odtwarzacza, ${err}`);
    }
}