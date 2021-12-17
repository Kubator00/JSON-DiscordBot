const getRandomInt = require("./getRandomInt.js");
module.exports = (msg, bot, questionMsg, cards, round) => {
    const max = getRandomInt(15, 18);
    const randomNumber = getRandomInt(0, cards.length);

    if (max > bot.result) {
        bot.addResult(cards[randomNumber].value);
        questionMsg.react('✅');
        round.push({
            id: bot.id,
            cardName: cards[randomNumber].name,
            cardValue: cards[randomNumber].value
        }); 
    }
    else {
        questionMsg.react('❌');
        msg.channel.send("```diff\n- Gracz " + bot.name + " zakończył rozgrywkę```")
        bot.setFinish();
    }
    return round;
}
 