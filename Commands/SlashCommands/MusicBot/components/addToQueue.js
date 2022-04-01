const queue = require('./queueMap');
const get_voice_connect = require('./getVoiceChannel').get_voice_connect;
const play_music = require('./playMusic').play_music;
const auto_leave = require('./autoLeave').auto_leave;
const {
    joinVoiceChannel,
} = require('@discordjs/voice');
const embedPlayer = require('./embedPlayer');
module.exports.add_to_queue = add_to_queue;
async function add_to_queue(msg, music, isPlaylist) {
    const songQueue = queue.get(msg.guild.id);
    if (songQueue)
        if (songQueue.songs?.length > 40)
            msg.channel.send('Kolejka zawiera zbyt dużą liczbę piosenek\nSpróbuj ponownie później').catch(err => console.log(err));

    let voiceChannel;
    try {
        voiceChannel = await get_voice_connect(msg)
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
        play_music(queueConstructor.guildId);
        setTimeout(() => auto_leave(queueConstructor.guildId), 5000);
    }
    else {
        serverQueue.songs.push(music);
        if (songQueue.songs.length != 1 && !isPlaylist)
            embedPlayer(serverQueue.guildId);
        if (songQueue.songs.length == 1)
            play_music(serverQueue.guildId);
    }

}