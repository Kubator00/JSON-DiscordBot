const getRandomInt = require('../../../Utilities/getRandomInt')
const loadJSON = require('../../../Utilities/loadJSON')
module.exports = {
    name: 'egzorcysta',
    aliases: ['boner', 'bogdan'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👊');
        const quotes = loadJSON(__dirname + '\\data\\', 'egzorcystaQuotes.json');
        const result = quotes[getRandomInt(0, quotes.length)];
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};

