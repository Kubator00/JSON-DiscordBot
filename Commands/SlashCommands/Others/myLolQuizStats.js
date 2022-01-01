const connect_database = require("../../../Database/databaseConn.js");
const { MessageEmbed } = require('discord.js');
const pg = require('pg');
module.exports = {
    name: 'quiz_lol_moje_statystyki',
    description: "Wyświetla twoje statystyki",
    async execute(msg) {
        let userInfo = await read_database(msg.guild.id, msg.user.id);
        if (!userInfo)
            return msg.followUp(`Brak danych o użytkowniku😥`);

        const guildMembers = msg.guild.members.cache;
        let nameToDisplay = guildMembers.get(userInfo['id_discord']).nickname;
        if (nameToDisplay == null)
            nameToDisplay = guildMembers.get(userInfo['id_discord']).user.username;

        const p = Math.round(userInfo['correct_answers'] * 100 / (userInfo['correct_answers'] + userInfo['wrong_answers']));
        let embed = new MessageEmbed()
            .setColor('#2ECC71')
            .setAuthor("Statystyki quizu o wiedzy z League of Legends\n")
            .setTimestamp()
            .addFields(
                {
                    name: nameToDisplay,
                    value: `Odpowiedzi poprawne: ${userInfo['correct_answers']},  błędne: ${userInfo['wrong_answers']}\nProcent dobrych odp: ${p}%`,
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
            clientConn.query(`SELECT id_discord, correct_answers, wrong_answers  from public."LOL_QUOTES_STATS" where id_guild='${guildId}' AND id_discord='${userId}'`, (err, res) => {
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
