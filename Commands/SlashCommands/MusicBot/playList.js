const music_functions = require("./Functions/all_functions.js")


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
        const url = msg.options.getString('url');
        let musicList = await music_functions.find_playlist(msg, url);
        if (musicList) {
            for (music of musicList) {
                if (await music_functions.add_to_queue(msg, music, true) == -1) {
                    break;
                }
            }
            music_functions.display_queue(msg);
        }

    },

}

