const displayVoiceStats = require("../../../VoiceStats/displayVoiceStats.js");

module.exports = {
    name: 'statystyki',
    description: "Wyświetla ranking osób z najłuższą ilością czasu spędzonego na kanałach głosowych",

    async execute(msg) {
        //sprawdza czy uzytkownik wywolujacy komende posiada role administratora 
        if ( msg.member.permissions.has('ADMINISTRATOR') != true) {
            msg.followUp(`Aby użyć tej komendy musisz posiadać rolę Administratora.`)
            return;
        }
        msg.followUp('.');
        displayVoiceStats.send_time_voice(msg.channel);
    }
}