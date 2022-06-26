import history from "../../SlashCommands/LolApi/components/history.js";
import basicAccountInfo from "../../SlashCommands/LolApi/components/basicAccountInfo.js";
import blockButton from "../../../Utilities/blockButton.js";
import {sendErrorMsg} from "../../SlashCommands/LolApi/components/lolCommonFunctions.js";

export default {
    name: 'lolhistory',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        try {
            msg.channel.send({embeds: [await history(summoner[1], msg.values[0])]});
            msg.channel.send(await basicAccountInfo(summoner[1]));
        } catch (error) {
            sendErrorMsg(error, msg);
        }
    }
}