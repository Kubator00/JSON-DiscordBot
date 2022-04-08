import {MessageEmbed} from "discord.js";
import poolDB from "../Database/databaseConn.js";

export default async function sendVoiceTimeRanking(channel) {
    let result = await readVoiceStatsFromDatabase(channel.guild.id);
    if (!result || result.length < 1)
        return;
    const guildMembers = channel.guild.members.cache;
    try {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle("Czas spędzony przez użytkowników na kanałach głosowych\n")
            .setDescription("Jeśli nie ma cie na liście możesz wpisać komendę /moje_dane")
            .setTimestamp()
            .addFields(
                generateEmbedFields(result, guildMembers)
            )
        channel.send({ embeds: [embed] });
    }

    catch (err) { console.log(`Błąd łączenia się z bazą ${err}`) }

}

function generateEmbedFields(usersInfo, guildMembers) {
    let result = [];
    let number = 1;
    let correctUsers = 0;
    for (let i = 0; i < usersInfo.length; i++) {
        if (correctUsers >= 20)
            break;
        let em = {};
        let hour = parseInt(usersInfo[i]['time_on_voice'] / 3600)
        let minute = parseInt(usersInfo[i]['time_on_voice'] / 60) - hour * 60;
        let nameToDisplay = guildMembers.get(usersInfo[i]['id_discord']);
        if (!nameToDisplay) //uzytkownik nie jest juz czlonkiem serwera
            continue;
        correctUsers += 1;
        nameToDisplay = guildMembers.get(usersInfo[i]['id_discord']).nickname;
        if (nameToDisplay == null)
            nameToDisplay = guildMembers.get(usersInfo[i]['id_discord']).user.username;
        em = {
            name: `${number} ${nameToDisplay} `,
            value: `${hour} godz. ${minute}min.`,
        }
        result.push(em);
        number += 1;
    }

    return result;
}


async function readVoiceStatsFromDatabase(guildId) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' ORDER BY time_on_voice DESC LIMIT 30;`)
        return result.rows;
    } catch (err) {
        console.log(err);
        return null;
    } finally{
        clientConn?.release();
    }
}