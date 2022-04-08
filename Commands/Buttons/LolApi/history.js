import history from "../../SlashCommands/LolApi/Functions/history.js";
import message from "../../SlashCommands/LolApi/Functions/message.js";
import blockButton from "../../../Utilities/blockButton.js";

export default {
    name: 'lolhistory',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await history(msg, summoner[1], msg.values[0]);
        await message(msg, summoner[1], false);
    }
}