const { MessageEmbed } = require('discord.js');
const database = require('./readStatsComponents/readVoiceStats.js');

module.exports.send_time_voice = send_time_voice;
async function send_time_voice(channel) {
    let result = await database.read_voice_stats(channel.guild.id);
    if (result.length < 1)
        return;
    const guildMembers = channel.guild.members.cache;
    try {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle("Czas spędzony przez użytkowników na kanałach głosowych\n")
            .setDescription("Jeśli nie ma cie na liście możesz wpisać komendę /mojczas")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                embed_display(result, guildMembers)
            )
        channel.send({ embeds: [embed] });
    }

    catch (err) { console.log(`Błąd łączenia się z bazą ${err}`) };

}

function embed_display(usersInfo, guildMembers) {
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
