const index = require("../../../index.js");
const errorNotifications = require("../../../errorNotifications.js");
const connect_database = require("../../../database/databaseConn.js");
const { MessageEmbed } = require('discord.js');
const pg = require('pg');
module.exports = {
    name: 'mojczas',
    description: "Wyświetla czas spędzony na kanałach głosowych",

    async execute(msg) {

        //sprawdza czy uzytkownik wywolujacy komende posiada role 
        // const roleName = "Zweryfikowany";
        // const roleId = (msg.guild.roles.cache.find(p => p.name === roleName)).id;
        // let hasRoles = 0;
        // for (userRole of msg.member._roles)
        //     if (userRole == roleId)
        //         hasRoles = 1;
        // if (hasRoles == 0 && msg.member.permissions.has('ADMINISTRATOR') != true)
        //     return msg.followUp(`Aby użyć tej komendy musisz posiadać rolę "${roleName}".`);
        let userInfo = await read_database(msg.guild.id, msg.user.id);
        if (userInfo.length < 1)
            return msg.followUp(`Brak danych o użytkowniku😥`);


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

async function read_database(guildId, userId) {
    const database = connect_database();
    return new Promise(function (resolve, reject) {
        const clientConn = new pg.Client(database);
        clientConn.connect(err => {
            if (err) return errorNotifications(`Blad polaczenia z baza ${err}`);
            clientConn.query(`SELECT username, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' AND id_discord='${userId}'`, (err, res) => {
                if (err) {
                    errorNotifications(`Blad polaczenia z baza ${err}`);
                    clientConn.end();
                }
                else {
                    clientConn.end();
                    resolve(res.rows[0]);
                }
            });
        });
    })
};
