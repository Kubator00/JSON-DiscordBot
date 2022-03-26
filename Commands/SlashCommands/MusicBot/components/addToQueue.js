const queue = require('./queueMap');
const get_voice_connect = require('./getVoiceChannel').get_voice_connect;
const play_music = require('./playMusic').play_music;
const auto_leave = require('./autoLeave').auto_leave;
const {
    joinVoiceChannel,
} = require('@discordjs/voice');
module.exports.add_to_queue = add_to_queue;
async function add_to_queue(msg, music, addPlaylist) {
    const songQueue = queue.get(msg.guild.id);
    try {
        if (songQueue)
            if (songQueue.songs.length > 1)
                throw new Error('Kolejka zawiera zbyt dużą liczbę piosenek\nSpróbuj ponownie później');
        voiceChannel = await get_voice_connect(msg)
    } catch (err) {
        msg.followUp(err.message);
        return;
    }

    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) {
        const queueConstructor = {
            voiceChannel: msg.member.voice.channel,
            textChannel: msg.channel,
            connection: null,
            songs: [],
            player: null,
            stream: null
        }
        queue.set(msg.guild.id, queueConstructor);
        queueConstructor.songs.push(music);

        connection = joinVoiceChannel(voiceChannel);
        queue.get(msg.guild.id).connection = connection;

        msg.followUp(`Teraz gramy: ${music.title}`);

        await play_music(msg);
        setTimeout(() => auto_leave(msg), 5000);
    }
    else {
        serverQueue.songs.push(music);
        if (addPlaylist == false)
            msg.followUp(`Dodano do kolejki: ${music.title}`);

        if (songQueue.songs.length == 1)
            await play_music(msg);
    }

}