import {sendVoiceTimeRanking, sendVoiceTimeRankingLast7Days} from "../../../VoiceStats/sendVoiceTimeRanking.js"
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('czas_na_kanalach')
        .setDescription('Wyświetla ranking osób z najłuższą ilością czasu spędzonego na kanałach głosowych'),
    async execute(msg) {
        //sprawdza czy uzytkownik wywolujacy komende posiada role administratora 
        if (msg.member.permissions.has('ADMINISTRATOR') !== true) {
            await msg.followUp(`Aby użyć tej komendy musisz posiadać rolę Administratora.`)
            return;
        }
        await msg.followUp('Statystyki:');
        await sendVoiceTimeRanking(msg.channel);
        await sendVoiceTimeRankingLast7Days(msg.channel);
    }
}