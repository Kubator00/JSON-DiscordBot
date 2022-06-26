import mastery from "../../SlashCommands/LolApi/components/mastery.js";
import basicAccountInfo from "../../SlashCommands/LolApi/components/basicAccountInfo.js";
import blockButton from "../../../Utilities/blockButton.js";
import {sendErrorMsg} from "../../SlashCommands/LolApi/components/lolCommonFunctions.js";

export default {
    name: 'lolmastery',
    async execute(msg) {
        await blockButton(msg);
        const summoner = msg.customId.split(':');
        try {
            msg.channel.send({embeds: [await mastery( summoner[1])]});
            msg.channel.send(await basicAccountInfo( summoner[1], false));
        } catch (err) {
            sendErrorMsg(err, msg);
        }
    }
}