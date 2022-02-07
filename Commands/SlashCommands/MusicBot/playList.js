const index = require('../../../index.js');
const channelNames = require('../../../Database/readChannelName.js');
const find_playlist = require('./components/findYtPlaylist.js').find_playlist;
const add_to_queue = require('./components/addToQueue.js').add_to_queue;
const display_queue = require('./components/displayQueue.js').display_queue;

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
        if (!await channelNames.check_channel(index.client, 'music_bot', msg))
            return;

        const url = msg.options.getString('url');
        let musicList = await find_playlist(msg, url);
        if (musicList) {
            for (music of musicList) {
                if (await add_to_queue(msg, music, true) == -1) {
                    break;
                }
            }
            display_queue(msg);
        }

    }
}

