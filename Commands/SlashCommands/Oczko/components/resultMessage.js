export default async function resultMsg(msg, players, playToNumber) {
    let winners = [];
    let min = playToNumber;
    for (let player of players) {
        if (playToNumber - player.result >= 0 && min > playToNumber - player.result) {
            min = Math.abs(playToNumber - player.result);
            winners = [];
            winners.push(player.name);
        }
        else if (min === playToNumber - player.result)
            winners.push(player.name);
    }
    let result = "```ini\n[Końcowy rezultat]\n";
    for (let player of players)
        result += `${player.name}: ${player.result}pkt\n`

    if (winners.length === 0)
        result += `Brak zwycięzcy, wszyscy gracze przekroczyli próg ${playToNumber}pkt`
    else if (winners.length === 1)
        result += `[Wygrał gracz ${winners[0]}]`;
    else {
        let drawMsg = "[Remis pomiędzmi graczami: ";
        for (let winner of winners)
            drawMsg += `${winner} `;
        result += drawMsg;
        result += `]`
    }
    result += "```";
    await msg.channel.send(result);
}