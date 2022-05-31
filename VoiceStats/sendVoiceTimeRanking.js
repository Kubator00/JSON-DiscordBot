import {MessageEmbed} from "discord.js";
import {readVoiceStatsFromDatabase, readVoiceStatsFromDatabaseLast7Days} from "./readStatsComponents/readVoiceStats.js";

export async function sendVoiceTimeRanking(channel) {
    let usersTime = await readVoiceStatsFromDatabase(channel.guild.id);
    if (!usersTime || usersTime.length < 1)
        return;
    const guildMembers = channel.guild.members.cache;
    await sendEmbed(channel, usersTime, guildMembers, "Czas spędzony na kanałach głosowych", "Jeśli nie ma cie na liście możesz wpisać komendę /moje_dane");
}

export async function sendVoiceTimeRankingLast7Days(channel) {
    const guildMembers = channel.guild.members.cache;
    let usersTimeLast7Days = await readVoiceStatsFromDatabaseLast7Days(channel.guild.id);
    if (!usersTimeLast7Days || usersTimeLast7Days.length < 1)
        return;

    let dateFrom = new Date(new Date().setDate(new Date().getDate() - 6)).toLocaleDateString();
    await sendEmbed(channel, usersTimeLast7Days, guildMembers, `Czas spędzony na kanałach głosowych w ostatnich 7 dniach\nOd ${dateFrom}`, " ")
}

async function sendEmbed(channel, usersTime, guildMembers, title, description) {
    try {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .addFields(
                generateEmbedFields(usersTime, guildMembers)
            )
        await channel.send({embeds: [embed]});
    } catch (err) {
        console.error(err);
    }
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





