import mastery from "../../SlashCommands/LolApi/Functions/mastery.js";
import message from "../../SlashCommands/LolApi/Functions/message.js";
import blockButton from "../../../Utilities/blockButton.js";

export default {
    name: 'lolmastery',

    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await mastery(msg, summoner[1])
        await message(msg, summoner[1], false);
    }
}