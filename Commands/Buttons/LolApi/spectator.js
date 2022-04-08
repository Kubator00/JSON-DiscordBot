import spectator from "../../SlashCommands/LolApi/Functions/spectator.js";
import message from "../../SlashCommands/LolApi/Functions/message.js";
import blockButton from "../../../Utilities/blockButton.js";

export default {
    name: 'lolspectator',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        await spectator(msg, summoner[1])
        await message(msg, summoner[1], false);
    }
}