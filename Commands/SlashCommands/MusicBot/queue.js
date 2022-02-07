const index = require('../../../index.js');
const display_queue = require("./components/displayQueue").display_queue;
const channelNames = require('../../../Database/readChannelName.js');

module.exports = {
    name: 'kolejka',
    description: "Zobacz listę następnie odtwarzanych piosenek",

    async execute(msg) {
        if (!await channelNames.check_channel(index.client, 'music_bot', msg))
            return;

        display_queue(msg);
    },

}

