import getRandomInt from "../../../Utilities/getRandomInt.js";
import loadJSON from "../../../Utilities/loadJSON.js";
import {dirname, join} from "path";
import {fileURLToPath} from 'url';

export default {
    name: 'star wars',
    aliases: ['gwiezdne wojny', 'hello there'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('⭐');
        const quotes = loadJSON(join(dirname(fileURLToPath(import.meta.url)),'data'),'starwarsQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};