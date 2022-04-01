const queue = require('../../SlashCommands/MusicBot/components/queueMap');

module.exports = {
    name: 'pause',
    async execute(msg) {
        msg.deferUpdate();

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