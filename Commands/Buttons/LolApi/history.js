const lolHistory = require('../../SlashCommands/LolApi/Functions/history');
const lolMessage = require('../../SlashCommands/LolApi/Functions/message');
const blockButton = require('../../../blockButton');
module.exports = {
    name: 'lolhistory',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await lolHistory(msg, summoner[1], msg.values[0]);
        await lolMessage(msg, summoner[1], false);
    }
}