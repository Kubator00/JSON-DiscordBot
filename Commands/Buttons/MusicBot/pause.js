import queue from "../../SlashCommands/MusicBot/components/queueMap.js";

export default{
    name: 'pause',
    async execute(msg) {
        await msg.deferUpdate();

        if (!queue.get(msg.guild.id))
            return;   //brak piosenek
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel)
                return; //uzytkownik poza kanalem glosowym
            const player = queue.get(msg.guild.id).player;
            player.pause()
        }
        catch (err) { }

    }
}