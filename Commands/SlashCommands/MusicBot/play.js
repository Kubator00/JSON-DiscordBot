const index = require('../../../index.js');
const musicFunctions = require("./Functions/musicCommonFunctions.js")
const channelNames = require('../../../database/readChannelName.js');

module.exports = {
    name: 'graj',
    description: "Odtwarzaj muzyke",
    options: [
        {
            name: "nazwa",
            description: "Nazwa lub URL piosenki",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) 
            return msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
        

        const url = msg.options.getString('nazwa');

        let song = await musicFunctions.find_music(msg, url);
        if (song) {
            await musicFunctions.add_to_queue(msg, song, false);
        }

    },

}

