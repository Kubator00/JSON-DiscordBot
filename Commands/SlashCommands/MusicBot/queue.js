const index = require('../../../index.js');
const display_queue = require("./components/displayQueue").display_queue;
const channelNames = require('../../../Database/readChannelName.js');

module.exports = {
    name: 'kolejka',
    description: "Zobacz listę następnie odtwarzanych piosenek",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }

        display_queue(msg);
    },

}

