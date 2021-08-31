const { MessageEmbed } = require('discord.js');
const database = require('./database.js');

module.exports.send_time_voice = send_time_voice;
async function send_time_voice(channel) {
    let result = await database.read_database("VOICE_COUNTER_USERS");
    try {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("Czas spędzony przez użytkowników na kanałach głosowych\n")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                embed_display(result)
            )
        channel.send({ embeds: [embed] });
    }

    catch { console.log("Błąd łączenia się z bazą") };

}

function embed_display(usersInfo) {
    usersInfo.sort(function (a, b) { return b['time_on_voice'] - a['time_on_voice']; });

    let result = [];
    let number = 1;
    let length = usersInfo.length;
    if (length > 15)
        length = 15;

    for (let i = 0; i < length; i++) {
        let em = {};
        let hour = parseInt(usersInfo[i]['time_on_voice'] / 3600)
        let minute = parseInt(usersInfo[i]['time_on_voice'] / 60) - hour * 60;
        em = {
            name: `${number} ${usersInfo[i]['username']} `,
            value: `${hour} godz. ${minute}min.`,
        }
        result.push(em);
        number += 1;
    }
    return result;

}
