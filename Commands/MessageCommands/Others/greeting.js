const getRandomInt = require('../../../Utilities/getRandomInt')
const loadJSON = require('../../../Utilities/loadJSON')
const path = require('path');

module.exports = {
    name: 'siema',
    aliases: ['witam', 'dzień dobry', 'dzien dobry', 'elo', 'hej', 'cześć', 'czesc'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('🖐️');
        const quotes = loadJSON(path.join(__dirname,'data'), 'greetingQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};