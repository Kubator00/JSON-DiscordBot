const showStats = require('../LolQuiz/components/showStats')
module.exports = {
    name: 'quiz_lol_statystyki',
    description: "Wyświetla ranking serwera",
    async execute(msg) {
        msg.followUp("Ranking:");
        showStats(msg.channel);
    }
}