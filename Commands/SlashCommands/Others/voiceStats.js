import {sendVoiceTimeRanking, sendVoiceTimeRankingLast7Days} from "../../../VoiceStats/sendVoiceTimeRanking.js"

export default {
    name: 'statystyki',
    description: "Wyświetla ranking osób z najłuższą ilością czasu spędzonego na kanałach głosowych",

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