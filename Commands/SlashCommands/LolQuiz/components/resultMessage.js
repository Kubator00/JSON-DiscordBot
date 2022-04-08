import {MessageEmbed} from "discord.js";

export default async function resultMsg(msg, players) {
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
    for (let player of players) {
        let em = {};
        em = {
            name: `${player.name} `,
            value: `Poprawne / Błędne odpowiedzi: ${player.correctAnswers} / ${player.wrongAnswers}`,
        }
        result.push(em);
    }
    return result;
}
