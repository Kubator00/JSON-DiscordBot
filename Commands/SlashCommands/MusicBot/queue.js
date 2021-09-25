const musicFunctions = require("./Functions/musicCommonFunctions.js")
const queue = musicFunctions.queue;
const channelNames=require('../../../channelNames');

module.exports = {
    name: 'kolejka',
    description: "Zobacz listę następnie odtwarzanych piosenek",

    async execute(msg) {
        if (msg.channel.name != channelNames.musicChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.musicChannel}`);
            return;
        }

        musicFunctions.display_queue(msg);
    },

}

