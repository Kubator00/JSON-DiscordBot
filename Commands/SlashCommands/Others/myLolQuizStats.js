const connect_database = require("../../../Database/databaseConn.js");
const { MessageEmbed } = require('discord.js');
const pg = require('pg');
module.exports = {
    name: 'quiz_lol_moje_statystyki',
    description: "Wyświetla twoje statystyki",
    async execute(msg) {
        try {
            var userInfo = await read_database(msg.guild.id, msg.user.id);
        } catch (err) {
            msg.followUp(err.message);
            return;
        }

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
    const clientConn = new pg.Client(database);

    let result = [];
    try {
        await clientConn.connect();
        await clientConn.query(`SELECT id_discord, correct_answers, wrong_answers  from public."LOL_QUOTES_STATS" where id_guild='${guildId}' AND id_discord='${userId}'`)
            .then(res => {
                const rows = res.rows;
                rows.map(row => {
                    result.push(row);
                })
            });
    } catch (err) {
        console.log(err)
        throw new Error('Błąd pobierania z bazy');
    } finally {
        await clientConn.end();
    }

    if (result.length < 1)
        throw new Error('Brak danych o użytkowniku');

    return result[0];
};
