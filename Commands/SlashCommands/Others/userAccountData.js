const connect_database = require("../../../Database/databaseConn.js");
const errorNotifications = require("../../../ErrorHandlers/errorHandlers").errorNotifications;
const { MessageEmbed } = require('discord.js');
const pg = require('pg');
module.exports = {
    name: 'moje_dane',
    description: "Wyświetla informacje o użytkowniku",

    async execute(msg) {

        let userInfo = await read_database(msg.guild.id, msg.user.id);

        let hour, minute;
        try {
            hour = parseInt(userInfo['time_on_voice'] / 3600)
            minute = parseInt(userInfo['time_on_voice'] / 60) - hour * 60;
        } catch (err) {
            hour = 0;
            minute = 0;
        }

        let nickname = msg.member.user.username.nickname
        if (!nickname)
            nickname = 'brak'

        try {
            let embed = new MessageEmbed()
                .setColor('#2ECC71')
                .setTitle(`Dane użytkownika ${msg.member.user.username}`)
                .setThumbnail(msg.member.user.displayAvatarURL())
                .setDescription(`Nickname: ${nickname}\n
            Data utworzenia konta: ${msg.member.user.createdAt.getUTCFullYear()}-${msg.member.user.createdAt.getMonth()}-${msg.member.user.createdAt.getDay()}\n
            Data dołączenia do serwera: ${msg.member.joinedAt.getUTCFullYear()}-${msg.member.joinedAt.getMonth()}-${msg.member.joinedAt.getDay()}\n
            Czas spędzony na kanałach głosowych: ${hour} godz. ${minute}min.`)
                .setTimestamp()

            msg.followUp({ embeds: [embed] });
        } catch (err) {
            console.log("Wystąpił błąd polecenia moje_dane")
            console.log(err);
        }
    }
}


async function read_database(guildId, userId) {
    const database = connect_database();
    return new Promise(function (resolve, reject) {
        const clientConn = new pg.Client(database);
        clientConn.connect(err => {
            if (err){
                console.log(err);
                return;
            } 
            clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' AND id_discord='${userId}'`, (err, res) => {
                if (err) {
                    console.log(err);
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
