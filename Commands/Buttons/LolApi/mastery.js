const lolMastery = require('../../SlashCommands/LolApi/Functions/mastery');
const lolMessage = require('../../SlashCommands/LolApi/Functions/message');
const blockButton = require('../../../blockButton');
module.exports = {
    name: 'lolmastery',

    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await lolMastery(msg, summoner[1])
        await lolMessage(msg, summoner[1], false);
    }
}