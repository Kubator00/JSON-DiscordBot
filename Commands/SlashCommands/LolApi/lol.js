import lolMessage from './components/basicAccountInfo.js';
import {SlashCommandBuilder} from "@discordjs/builders";
import {sendErrorMsg} from "./components/lolCommonFunctions.js";

export default {
    data: new SlashCommandBuilder()
        .setName('lol')
        .setDescription('Wyświetla dane konta z LeagueOfLegends')
        .addStringOption(option =>
            option.setName('nazwa')
                .setDescription('Nazwa przywoływacza, serwer EUNE')
                .setRequired(true)),
    async execute(msg) {
        let summoner = msg.options.getString('nazwa');
        try {
            await msg.followUp(await lolMessage(summoner));
        } catch (err) {
            sendErrorMsg(err, msg);
        }
    }
}