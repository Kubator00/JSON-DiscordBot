import getRandomInt from "../../../Utilities/getRandomInt.js";
import loadJSON from "../../../Utilities/loadJSON.js";
import {dirname, join} from "path";
import {fileURLToPath} from 'url';

export default{
    name: 'egzorcysta',
    aliases: ['boner', 'bogdan'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('👊');
        const quotes = loadJSON(join( dirname(fileURLToPath(import.meta.url)),'data'), 'egzorcystaQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};

