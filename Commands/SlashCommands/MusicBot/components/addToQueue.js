import queue from "./queueMap.js";
import embedPlayer from "./sendPlayerEmbed.js";
import getVoiceConnection from "./getVoiceChannel.js";
import playMusic from "./playMusic.js";
import autoLeaveChannel from "./autoLeave.js";
import {joinVoiceChannel} from "@discordjs/voice";


export default async function addSongToQueue(msg, music, voiceChannel) {
    const songQueue = queue.get(msg.guild.id);
    try {
        if (songQueue?.songs?.length > 40)
            throw new Error('Kolejka zawiera zbyt dużą liczbę piosenek\nSpróbuj ponownie później');

    } catch (err) {
        throw err;
    }

    let serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) {
        createNewQueue(msg, voiceChannel);
        serverQueue = queue.get(msg.guild.id);
        serverQueue.songs.push(music);
        return;

    }
    serverQueue.songs.push(music);
}

const createNewQueue = (msg, voiceChannel) => {
    const queueConstructor = {
        guildId: msg.guild.id,
        voiceChannel: msg.member.voice.channel,
        textChannel: msg.channel,
        connection: joinVoiceChannel(voiceChannel),
        player: null,
        stream: null,
        songs: [],
    }
    queue.set(msg.guild.id, queueConstructor);
}