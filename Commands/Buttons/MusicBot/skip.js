import queue from "../../SlashCommands/MusicBot/components/queueMap.js";
import playMusic from "../../SlashCommands/MusicBot/components/playMusic.js";
import sendPlayerEmbed from "../../SlashCommands/MusicBot/components/sendPlayerEmbed.js";
export default{
    name: 'skip',
    async execute(msg) {
        await msg.deferUpdate();
        if (!queue.get(msg.guild.id))
            return;
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return;
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            queue.get(msg.guild.id).songs.shift();
            playMusic(msg.guild.id, false);
            await sendPlayerEmbed(msg.guild.id);
        }
        catch (err) {
            console.log(err);
        }

    }
}