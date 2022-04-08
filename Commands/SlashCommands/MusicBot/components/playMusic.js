import ytdl from "ytdl-core";
import queue from "./queueMap.js";
import embedPlayer from "./embedPlayer.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
} from '@discordjs/voice';

export default async function playMusic(guildId) {
    const songQueue = queue.get(guildId);
    try {
        if (songQueue.songs.length === 0) {
            await embedPlayer(guildId);
            return;
        }
    } catch (err) {
        await embedPlayer(guildId);
        return;
    }

    const stream = ytdl(songQueue.songs[0].url, {filter: 'audioonly', highWaterMark: 33554432})
        .on('error', error => {
            console.log(error);
            playMusic(guildId);
        });

    queue.get(guildId).stream = stream;

    const resource = createAudioResource(stream, {seek: 0, volume: 1});
    let player;
    if (!queue.get(guildId).player) {
        player = createAudioPlayer();
        queue.get(guildId).player = player;
    } else
        player = queue.get(guildId).player;

    await embedPlayer(guildId);

    try {
        player.play(resource);
        queue.get(guildId).connection.subscribe(player);
        player.on('error', error => {
            console.log(error);
            queue.get(guildId).player.removeAllListeners();
            stream.destroy();
            playMusic(guildId);
        })

        player.on(AudioPlayerStatus.Idle, () => {
            songQueue.songs.shift();
            queue.get(guildId).player.removeAllListeners();
            stream.destroy();
            playMusic(guildId)
        });
    } catch (err) {
        console.log(`Blad odtwarzacza, ${err}`);
    }
}