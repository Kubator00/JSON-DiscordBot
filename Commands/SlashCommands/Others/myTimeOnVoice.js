const connect_database = require("../../../Database/databaseConn.js");
const errorNotifications = require("../../../ErrorHandlers/errorHandlers").errorNotifications;
const { MessageEmbed } = require('discord.js');
const pg = require('pg');
module.exports = {
    name: 'mojczas',
    description: "Wyświetla czas spędzony na kanałach głosowych",

    async execute(msg) {

        let userInfo = await read_database(msg.guild.id, msg.user.id);
        if (userInfo.length < 1)
            return msg.followUp(`Brak danych o użytkowniku😥`);


        let hour = parseInt(userInfo['time_on_voice'] / 3600)
        let minute = parseInt(userInfo['time_on_voice'] / 60) - hour * 60;
        const guildMembers = msg.guild.members.cache;
        let nameToDisplay = guildMembers.get(userInfo['id_discord']).nickname;
        if (nameToDisplay == null)
            nameToDisplay = guildMembers.get(userInfo['id_discord']).user.username;
        let embed = new MessageEmbed()
            .setColor('#2ECC71')
            .setAuthor("Czas spędzony przez użytkownika na kanałach głosowych\n")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                {
                    name: nameToDisplay,
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
            clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' AND id_discord='${userId}'`, (err, res) => {
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
