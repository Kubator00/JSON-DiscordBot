const lolSpectator = require('../../SlashCommands/LolApi/Functions/spectator');
const lolMessage = require('../../SlashCommands/LolApi/Functions/message');
const blockButton=require('../../../blockButton');
module.exports = {
    name: 'lolspectator',
    
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await lolSpectator(msg, summoner[1])
        await lolMessage(msg, summoner[1], false);
    }
}