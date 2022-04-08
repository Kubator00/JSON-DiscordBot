import queue from "./queueMap.js";
import embedPlayer from "./embedPlayer.js";
import getVoiceConnection from "./getVoiceChannel.js";
import playMusic from "./playMusic.js";
import autoLeaveChannel from "./autoLeave.js";
import {joinVoiceChannel} from "@discordjs/voice";



export default async function addSongToQueue(msg, music, isPlaylist) {
    const songQueue = queue.get(msg.guild.id);
    if (songQueue)
        if (songQueue.songs?.length > 40)
            msg.channel.send('Kolejka zawiera zbyt dużą liczbę piosenek\nSpróbuj ponownie później').catch(err => console.log(err));

    let voiceChannel;
    try {
        voiceChannel = await getVoiceConnection(msg)
    } catch (err) {
        msg.channel.send(err).catch(err => console.log(err));
    }

    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) {
        const queueConstructor = {
            guildId: msg.guild.id,
            voiceChannel: msg.member.voice.channel,
            textChannel: msg.channel,
            connection:  joinVoiceChannel(voiceChannel),
            player: null,
            stream: null,
            songs: [],
        }

        queue.set(msg.guild.id, queueConstructor);
        queueConstructor.songs.push(music);
        playMusic(queueConstructor.guildId);
        setTimeout(() => autoLeaveChannel(queueConstructor.guildId), 5000);
    }
    else {
        serverQueue.songs.push(music);
        if (songQueue.songs.length !== 1 && !isPlaylist)
            embedPlayer(serverQueue.guildId);
        if (songQueue.songs.length === 1)
            playMusic(serverQueue.guildId);
    }

}