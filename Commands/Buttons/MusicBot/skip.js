const embedPlayer = require('../../SlashCommands/MusicBot/components/embedPlayer');
const queue = require('../../SlashCommands/MusicBot/components/queueMap');
const play_music = require('../../SlashCommands/MusicBot/components/playMusic').play_music;

module.exports = {
    name: 'skip',
    async execute(msg) {
        msg.deferUpdate();
        if (!queue.get(msg.guild.id))
            return;
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return;
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            queue.get(msg.guild.id).songs.shift();
            play_music(msg.guild.id, false);
        }
        catch (err) {
            console.log(err);
        }

    }
}