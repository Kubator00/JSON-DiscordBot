const musicFunctions = require("./Functions/musicCommonFunctions.js")
const queue = musicFunctions.queue;
const channelNames=require('../../../channelNames');

module.exports = {
    name: 'usun',
    options: [
        {
            name: "nr_piosenki",
            description: "Numer piosenki którą chcemy usunąć z kolejki",
            type: "NUMBER",
            required: true
        },
    ],
    description: "Usuwamy piosenkę podaną w argumencie z kolejki",
    async execute(msg) {
        if (msg.channel.name != channelNames.musicChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.musicChannel}`);
            return;
        }
        
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return await msg.reply("Musisz być na kanale głosowym aby usunąć piosenkę!")
            .catch(error => error_message("Błąd wysłania wiadomości"));

        const musicNubmer = msg.options.getNumber('nr_piosenki');

        const serverQueue = queue.get(msg.guild.id);


        if (!serverQueue || serverQueue.length <= 1) {
            msg.followUp("Nie ma piosenek w kolejce");
        }

        if (musicNubmer > serverQueue.songs.length || musicNubmer <= 0) {
            msg.followUp("Podano błędny numer piosenki");
        }

        queue.get(msg.guild.id).songs.splice(musicNubmer, 1);

        msg.followUp("Usunięto piosenkę");
    }
}
