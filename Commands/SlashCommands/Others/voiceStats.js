const displayVoiceStats = require("../../../voiceStats/displayVoiceStats.js");

module.exports = {
    name: 'statystyki',
    description: "Wyświetla statystyki",

    async execute(msg) {
        msg.followUp('.');
        displayVoiceStats.send_time_voice(msg.channel);
    }
}