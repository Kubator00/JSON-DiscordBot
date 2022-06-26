import spectator from "../../SlashCommands/LolApi/components/spectator.js";
import basicAccountInfo from "../../SlashCommands/LolApi/components/basicAccountInfo.js";
import blockButton from "../../../Utilities/blockButton.js";
import {sendErrorMsg} from "../../SlashCommands/LolApi/components/lolCommonFunctions.js";

export default {
    name: 'lolspectator',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        try {
            msg.channel.send({embeds: [await spectator(summoner[1])]});
        } catch (err) {
            sendErrorMsg(err, msg);
        }
        try {
            msg.channel.send(await basicAccountInfo(summoner[1]));
        } catch (err) {
            sendErrorMsg(err, msg);
        }
    }
}