const queue = require('../../SlashCommands/MusicBot/components/queueMap');
const playMusic = require('../../SlashCommands/MusicBot/components/playMusic').play_music;

module.exports = {
    name: 'gotosong',
    async execute(msg) {
        const musicNubmer = msg.values[0];
        if (!queue.get(msg.guild.id))
            return;

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return; //uzytkonik musi byc na kanale glosowym

        const serverQueue = queue.get(msg.guild.id);

        if (!serverQueue || serverQueue.length <= 1) 
            return;
        
        if (musicNubmer > serverQueue.songs.length || musicNubmer < 0) 
            return;
        

        queue.get(msg.guild.id).songs.splice(0, musicNubmer);
        playMusic(msg.guild.id);
    }
}