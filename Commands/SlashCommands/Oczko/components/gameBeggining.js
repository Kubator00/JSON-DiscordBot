import getRandomInt from "../../../../Utilities/getRandomInt.js";
import {MessageEmbed} from "discord.js";

export default (msg, cards, players,playToNumber) => {
    let round = [];
    for (let i in players) {
        const randNumber1 = getRandomInt(0, cards.length);
        const randNumber2 = getRandomInt(0, cards.length);
        players[i].addResult(cards[randNumber1].value);
        players[i].addResult(cards[randNumber2].value);
        round.push({
            id: players[i].id,
            cards: [
                {
                    cardName: cards[randNumber1].name,
                    cardValue: cards[randNumber1].value
                },
                {
                    cardName: cards[randNumber2].name,
                    cardValue: cards[randNumber2].value
                },
            ]
        });
    }
    let imgUrl;
    let max = 0;
    //wyswietla w wiadomosci avatar z osoba ktora jest najblizej wyniku
    players.forEach(element => {
        if (element.result > max && element.result <= playToNumber) {
            max = element.result;
            imgUrl = element.avatar;
        }
    });
    let embedF = new MessageEmbed()
        .setColor('#ffa500')
        .setTitle(`Rozdane karty`)
        .setThumbnail(imgUrl)
        .addFields(
            generateFirstEmbedFields(players, round)
        )
    msg.channel.send({ embeds: [embedF] });
}

function generateFirstEmbedFields(players, round) {
    let result = [];
    for (let i in round) {
        const player = players.find(element => element.id === round[i].id);
        result.push(
            {
                name: `Gracz ${player.name}`,
                value: `Wylosowane karty: ${round[i].cards[0].cardName}, ${round[i].cards[1].cardName} \nObecny wynik: ${player.result}pkt`
            }
        );
    }
    return result;
}