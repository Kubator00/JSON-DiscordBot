module.exports.resultMsg = resultMsg;

async function resultMsg(msg, players, numberOfRounds) {
    let result = "```ini\n[Końcowy rezultat]\n";
    for (player of players)
        result += `${player.name} -> P/B odp:${player.correctAnswers}/${player.wrongAnswers}\n`

    result += "```";
    await msg.channel.send(result);
}