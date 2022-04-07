const getRandomInt = require('../../../Utilities/getRandomInt')
const loadJSON = require('../../../Utilities/loadJSON')
const path = require('path');

module.exports = {
    name: 'gramy',
    aliases: ['zagramy', 'robimy coś', 'grasz'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('👍');
        const quotes = loadJSON(path.join(__dirname,'data'), 'playQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};