const queue = require('../../SlashCommands/MusicBot/components/queueMap');
const embedPlayer = require('../../SlashCommands/MusicBot/components/embedPlayer');


module.exports = {
    name: 'leave',
    async execute(msg) {
        try {
            msg.deferUpdate();
            const conn = queue.get(msg.guild.id).connection;
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return;
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            conn.destroy();
            queue.delete(msg.guild.id);
        }
        catch (err) { }
        embedPlayer(msg.guild.id);
    }
}