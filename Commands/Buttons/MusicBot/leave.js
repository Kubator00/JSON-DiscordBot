import queue from "../../SlashCommands/MusicBot/components/queueMap.js";
import embedPlayer from "../../SlashCommands/MusicBot/components/sendPlayerEmbed.js";

export default {
    name: 'leave',
    async execute(msg) {
        try {
            await msg.deferUpdate();
            const conn = queue.get(msg.guild.id).connection;
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel)
                return;
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            conn.destroy();
            queue.delete(msg.guild.id);
        } catch (err) {
        }
        await embedPlayer(msg.guild.id);
    }
}