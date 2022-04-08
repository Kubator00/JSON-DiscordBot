import {client} from "../../../index.js";
import {checkIfChannelIsCorrect} from "../../../Database/readChannelName.js";
import findPlaylistYT from "./components/findYtPlaylist.js";
import addSongToQueue from "./components/addToQueue.js";
import embedPlayer from "./components/embedPlayer.js";

export default {
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
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg))
            return;

        const url = msg.options.getString('url');
        let musicList = await findPlaylistYT(msg, url);
        if (musicList) {
            for (let music of musicList) {
                if (await addSongToQueue(msg, music, true) === -1) {
                    break;
                }
            }
        }
        embedPlayer(msg.guild.id);
    }
}

