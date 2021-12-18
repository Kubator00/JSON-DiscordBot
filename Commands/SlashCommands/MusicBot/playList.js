const index = require('../../../index.js');
const musicFunctions = require("./Functions/musicCommonFunctions.js")
const channelNames = require('../../../database/readChannelName.js');

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
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
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

