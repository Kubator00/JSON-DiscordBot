const lolHistory = require('../../SlashCommands/LolApi/Functions/history');
const lolMessage = require('../../SlashCommands/LolApi/Functions/message');
const blockButton = require('../../../Utilities/blockButton');
module.exports = {
    name: 'lollastgamehistory',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await lolHistory(msg, summoner[1], 1);
        await lolMessage(msg, summoner[1], false);
    }
}