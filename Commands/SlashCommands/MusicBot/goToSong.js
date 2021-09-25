const musicFunctions = require("./Functions/musicCommonFunctions.js")
const queue = musicFunctions.queue;
const channelNames=require('../../../channelNames');

module.exports = {
    name: 'przejdz',
    options: [
        {
            name: "nr_piosenki",
            description: "Numer piosenki którą chcemy odtworzyć",
            type: "NUMBER",
            required: true
        },
    ],
    description: "Gram piosenkę o numerze podanym w argumencie",

    async execute(msg) {
        if (msg.channel.name != channelNames.musicChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.musicChannel}`);
            return;
        }

        if (!queue.get(msg.guild.id))
            return msg.followUp("Brak piosenki");
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby zmienić piosenkę!");

        const musicNubmer = msg.options.getNumber('nr_piosenki');
        const serverQueue = queue.get(msg.guild.id);


        if (!serverQueue || serverQueue.length <= 1) {
            msg.followUp("Nie ma piosenek w kolejce");
            return;
        }

        if (musicNubmer > serverQueue.songs.length || musicNubmer <= 0) {
            msg.followUp("Podano błędny numer piosenki");
            return;
        }
        
        queue.get(msg.guild.id).songs.splice(0, musicNubmer);
        musicFunctions.display_now_playing(msg);
        return musicFunctions.play_music(msg);
    },

}
