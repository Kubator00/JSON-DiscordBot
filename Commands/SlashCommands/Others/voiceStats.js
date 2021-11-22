const displayVoiceStats = require("../../../voiceStats/displayVoiceStats.js");

module.exports = {
    name: 'statystyki',
    description: "Wyświetla ranking osób z najłuższą ilością czasu spędzonego na kanałach głosowych",

    async execute(msg) {
        const roleName = "Zweryfikowany";
        const roleId = (msg.guild.roles.cache.find(p => p.name === roleName)).id;
        let hasRoles = 0;
        for (userRole of msg.member._roles)
            if (userRole == roleId)
                hasRoles = 1;

        if (hasRoles == 0 && msg.member.permissions.has('ADMINISTRATOR') != true) {
            msg.followUp(`Aby użyć tej komendy musisz posiadać rolę "${roleName}".`)
            return;
        }
        msg.followUp('.');
        displayVoiceStats.send_time_voice(msg.channel);
    }
}