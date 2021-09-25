const musicFunctions = require("./Functions/musicCommonFunctions.js")
const channelNames=require('../../../channelNames');

module.exports = {
    name: 'grajliste',
    description: "Odtwarzaj całą playliste z Youtube-a",
    options: [
        {
            name: "url",
            description: "URL playlisty z Youtube",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        if (msg.channel.name != channelNames.musicChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.musicChannel}`);
            return;
        }
        
        const url = msg.options.getString('url');
        let musicList = await musicFunctions.find_playlist(msg, url);
        if (musicList) {
            for (music of musicList) {
                if (await musicFunctions.add_to_queue(msg, music, true) == -1) {
                    break;
                }
            }
            musicFunctions.display_queue(msg);
        }

    },

}

