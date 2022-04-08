import getRandomInt from "../../../../Utilities/getRandomInt.js";
export default async  (msg, bot, questionMsg, cards, round) => {
    const max = getRandomInt(15, 18);
    const randomNumber = getRandomInt(0, cards.length);

    if (max > bot.result) {
        bot.addResult(cards[randomNumber].value);
        await questionMsg.react('✅');
        round.push({
            id: bot.id,
            cardName: cards[randomNumber].name,
            cardValue: cards[randomNumber].value
        }); 
    }
    else {
        await questionMsg.react('❌');
        msg.channel.send("```diff\n- Gracz " + bot.name + " zakończył rozgrywkę```")
        bot.setFinish();
    }
    return round;
}
 