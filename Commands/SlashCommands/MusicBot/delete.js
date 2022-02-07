const index = require('../../../index.js');
const queue = require('./components/queueMap.js');
const channelNames = require('../../../Database/readChannelName.js');

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
        if (!await channelNames.check_channel(index.client, 'music_bot', msg))
            return;

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby usunąć piosenkę!");

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
