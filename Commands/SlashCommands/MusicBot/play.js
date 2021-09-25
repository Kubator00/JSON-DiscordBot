const musicFunctions = require("./Functions/musicCommonFunctions.js")
const channelNames=require('../../../channelNames');

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
        if (msg.channel.name != channelNames.musicChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.musicChannel}`);
            return;
        }

        const url = msg.options.getString('nazwa');

        let song = await musicFunctions.find_music(msg, url);
        if (song) {
            await musicFunctions.add_to_queue(msg, song, false);
        }

    },

}

