const index = require('../../../index.js');
const musicFunctions = require("./Functions/musicCommonFunctions.js")
const queue = musicFunctions.queue;
const channelNames = require('../../../database/readChannelName.js');

module.exports = {
    name: 'kolejka',
    description: "Zobacz listę następnie odtwarzanych piosenek",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }

        musicFunctions.display_queue(msg);
    },

}

