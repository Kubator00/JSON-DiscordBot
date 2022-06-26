import history from "../../SlashCommands/LolApi/components/history.js";
import blockButton from "../../../Utilities/blockButton.js";
import {sendErrorMsg} from "../../SlashCommands/LolApi/components/lolCommonFunctions.js";
import basicAccountInfo from "../../SlashCommands/LolApi/components/basicAccountInfo.js";

export default {
    name: 'lollastgamehistory',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        try {
            msg.channel.send({embeds: [await history(summoner[1], 1)]});
            msg.channel.send(await basicAccountInfo(summoner[1]));
        } catch (err) {
            sendErrorMsg(err, msg);
        }
    }
}