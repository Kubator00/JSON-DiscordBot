import {client} from "../../../index.js";
import {checkIfChannelIsCorrect} from "../../../Database/readChannelName.js";
import findMusicYT from "./components/findYtMusic.js";
import addSongToQueue from "./components/addToQueue.js";


export default {
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
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg))
            return;

        const url = msg.options.getString('nazwa');

        let song = await findMusicYT(msg, url);
        if (song)
            await addSongToQueue(msg, song, false);

    },
}

