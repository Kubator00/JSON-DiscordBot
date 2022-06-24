import showStats from "../LolQuiz/components/showStats.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('lol_quiz_statystyki')
        .setDescription('Wyświetla najlepszych graczy serwera z quizu o LeagueOfLegends'),
    async execute(msg) {
        await msg.followUp("Ranking:");
        showStats(msg.channel);
    }
}