import poolDB from '../../../Database/databaseConn.js'
import {MessageEmbed} from "discord.js";

export default {
    name: 'quiz_lol_moje_statystyki',
    description: "Wyświetla twoje statystyki",
    async execute(msg) {
        let userInfo;
        try {
            userInfo = await readStatsFromDatabase(msg.guild.id, msg.user.id);
        } catch (err) {
            await msg.followUp(err.message);
            return;
        }
        if (userInfo.length < 1)
            return await msg.followUp("Brak danych o użytkowniku");

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

        await msg.followUp({embeds: [embed]});
    }
}

async function readStatsFromDatabase(guildId, userId) {
    let clientConn;

    try {
        clientConn = await poolDB.connect();
        let result = await clientConn.query(`SELECT id_discord, correct_answers, wrong_answers  from public."LOL_QUOTES_STATS" where id_guild='${guildId}' AND id_discord='${userId}'`);
        if (result.rows.length > 0)
            return result.rows[0];
    } catch (err) {
        console.log(err)
        throw new Error('Błąd pobierania z bazy');
    } finally {
        await clientConn?.release();
    }

}
