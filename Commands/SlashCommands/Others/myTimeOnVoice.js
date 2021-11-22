const index = require("../../../index.js");
const database = require("../../../database.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mojczas',
    description: "Wyświetla czas spędzony na kanałach głosowych",

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


        let usersInfo = await database.read_database("VOICE_COUNTER_USERS");
        let userInfo;


        for (user of usersInfo)
            if (user['id'] == msg.user.id)
                userInfo = user;

        let hour = parseInt(userInfo['time_on_voice'] / 3600)
        let minute = parseInt(userInfo['time_on_voice'] / 60) - hour * 60;

        let embed = new MessageEmbed()
            .setColor('#2ECC71')
            .setAuthor("Czas spędzony przez użytkownika na kanałach głosowych\n")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                {
                    name: userInfo['username'],
                    value: `${hour} godz. ${minute}min.`,
                },
            )

        msg.followUp({ embeds: [embed] });
    }
}