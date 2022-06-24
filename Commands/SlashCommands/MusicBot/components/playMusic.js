import ytdl from "ytdl-core";
import queue from "./queueMap.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
} from '@discordjs/voice';
import {emitter} from "./event.js";

export default function playMusic(guildId) {
    const songQueue = queue.get(guildId);
    if (songQueue?.songs.length < 1)
        return;

    const stream = createStream(guildId, songQueue);
    const resource = createAudioResource(stream, {seek: 0, volume: 1});
    let player = getAudioPlayer(guildId);

    try {
        player.play(resource);
        queue.get(guildId).connection.subscribe(player);
        player.on('error', error => {
            console.log(error);
            onPlayingEnd(songQueue, guildId, stream);
        })
        player.on(AudioPlayerStatus.Idle, () => {
            onPlayingEnd(songQueue, guildId, stream);
        });
    } catch (err) {
        console.error(err);
    }
}

const createStream = (guildId, songQueue) => {
    return queue.get(guildId).stream =
        ytdl(songQueue.songs[0].url, {filter: 'audioonly', highWaterMark: 33554432})
            .on('error', error => {
                console.log(error);
                playMusic(guildId);
            });
}

const getAudioPlayer = (guildId) => {
    if (!queue.get(guildId).player)
        queue.get(guildId).player = createAudioPlayer();
    return queue.get(guildId).player;
}

const onPlayingEnd = (songQueue, guildId, stream) => {
    songQueue.songs.shift();
    emitter.emit('musicEnd', guildId);
    queue.get(guildId).player.removeAllListeners();
    stream.destroy();
    playMusic(guildId)
}