const { MessageEmbed } = require('discord.js');
const database = require('./readVoiceStats.js');

module.exports.send_time_voice = send_time_voice;
async function send_time_voice(channel) {
    let result = await database.read_voice_stats(channel.guild.id);
    if (result.length < 1)
        return;
    try {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("Czas spędzony przez użytkowników na kanałach głosowych\nameToDisplay")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                embed_display(result)
            )
        channel.send({ embeds: [embed] });
    }

    catch (err) { console.log(`Błąd łączenia się z bazą ${err}`) };

}

function embed_display(usersInfo) {
    let result = [];
    let number = 1;
    for (let i = 0; i < usersInfo.length; i++) {
        let em = {};
        let hour = parseInt(usersInfo[i]['time_on_voice'] / 3600)
        let minute = parseInt(usersInfo[i]['time_on_voice'] / 60) - hour * 60;
        let nameToDisplay = usersInfo[i]['nickname'];
        if (!nameToDisplay || nameToDisplay=='null' || nameToDisplay=='undefined')
            nameToDisplay = usersInfo[i]['username'];
        em = {
            name: `${number} ${nameToDisplay} `,
            value: `${hour} godz. ${minute}min.`,
        }
        result.push(em);
        number += 1;
    }
    return result;
}
