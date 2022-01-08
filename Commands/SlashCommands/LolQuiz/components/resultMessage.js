module.exports.resultMsg = resultMsg;
const { MessageEmbed } = require('discord.js');
const Player = require('./player');

async function resultMsg(msg, players) {
    let embed = new MessageEmbed()
        .setColor('#ffa500')
        .setTitle("Końcowy rezultat rozgrywki")
        .setTimestamp()
        .addFields(
            embed_display(players)
        )
    msg.channel.send({ embeds: [embed] });

}


function embed_display(players) {
    let result = [];
    for (player of players) {
        let em = {};
        em = {
            name: `${player.name} `,
            value: `Poprawne / Błędne odpowiedzi: ${player.correctAnswers} / ${player.wrongAnswers}`,
        }
        result.push(em);
    }
    return result;
}
