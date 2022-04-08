import {MessageEmbed} from "discord.js";
export default async function roundEndMsg(msg, round, players, playToNumber) {
    let imgUrl;
    let max = 0;
    //wyswietla w wiadomosci avatar z osoba ktora jest najblizej wyniku
    players.forEach(element => {
        if (element.result > max && element.result <= playToNumber) {
            max = element.result;
            imgUrl = element.avatar;
        }
    });

    if (round.length > 0) {
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle(`Runda zakończona`)
            .setThumbnail(imgUrl)
            .addFields(
                generateEmbedFields(players, round)
            )
        await msg.channel.send({ embeds: [embed] });
    }
}

function generateEmbedFields(players, round) {
    let result = [];
    for (let i in round) {
        const player = players.find(element => element.id === round[i].id);
        result.push(
            {
                name: `Gracz ${player.name}`,
                value: `Wylosowana karte: ${round[i].cardName}\nObecny wynik: ${player.result}pkt`
            }
        );
    }
    return result;
}