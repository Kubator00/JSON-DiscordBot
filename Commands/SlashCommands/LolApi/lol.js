import {checkIfChannelIsCorrect} from "../../../Database/getChannel.js";
import lolMessage from './Functions/message.js';
import {client} from "../../../index.js";
import {SlashCommandBuilder} from "@discordjs/builders";

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
        await lolMessage(msg, summoner, true);
    }
}