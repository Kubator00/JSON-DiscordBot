import {checkIfChannelIsCorrect} from "../../../Database/readChannelName.js";
import lolMessage from './Functions/message.js';
import {client} from "../../../index.js";

export default {
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
        let summoner = msg.options.getString('nazwa');
        await lolMessage(msg, summoner, true);
    }
}