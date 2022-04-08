import showStats from "../LolQuiz/components/showStats.js";
export default {
    name: 'quiz_lol_statystyki',
    description: "Wyświetla ranking serwera",
    async execute(msg) {
       await msg.followUp("Ranking:");
        showStats(msg.channel);
    }
}