const getRandomInt = require('../../../Utilities/getRandomInt')
const loadJSON = require('../../../Utilities/loadJSON')
const path = require('path');

module.exports = {
    name: 'do widzenia',
    aliases: ['dobranoc', 'nara', 'paa', 'narazie', 'pa pa'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('🖐️');
        const quotes = loadJSON(path.join(__dirname,'data'), 'farewellQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};