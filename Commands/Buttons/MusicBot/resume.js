import queue from "../../SlashCommands/MusicBot/components/queueMap.js";

export default {
    name: 'resume',
    async execute(msg) {
        msg.deferUpdate();
        if (!queue.get(msg.guild.id))
            return; //brak piosenek
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return; //uzytkownik poza kanalem glosowym
            const player = queue.get(msg.guild.id).player;
            player.unpause()
        }
        catch (err) { }
    }
}