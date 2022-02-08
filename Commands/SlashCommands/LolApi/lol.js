const lolMessage = require('./Functions/message')
const channelNames = require('../../../Database/readChannelName.js');
const index = require('../../../index')
module.exports = {
    name: 'lol',
    description: "Wyświetla dane konta League of Legends",
    options: [
        {
            name: "nazwa",
            description: "Nazwa przywoływacza, serwer EUNE",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        if (!await channelNames.check_channel(index.client, 'lol_statistics', msg))
            return;
        let summoner = msg.options.getString('nazwa');
        await lolMessage(msg, summoner, true);
    }
}