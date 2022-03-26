const loadCards = require("../../../Utilities/loadJSON");
const joinMsg = require("./components/joinMessage.js").joinMsg;
const roundEndMsg = require("./components/roundEndMessage.js").roundEndMsg;
const resultMsg = require("./components/resultMessage.js").resultMsg;
const getRandomInt = require("./components/getRandomInt.js");
const bot = require("./components/bot.js");
const gameStart = require("./components/gameBeggining.js");
const path = require('path');


module.exports = {
    name: 'oczko',
    description: "Zagraj w oczko",

    async execute(msg) {
        const playToNumber = 21;
        const timeToReaction = 7000;
        let playerIndex;
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id == players[playerIndex].id;
        };
        const cards = loadCards(path.join(__dirname,'components'),'cards.json');
        let players = [];
        let gameIsFinish = () => {
            for (player of players)
                if (!player.isFinish)
                    return false;
            return true;
        }
        let playerEndGame = () => {
            if (players[playerIndex].result >= playToNumber) {
                players[playerIndex].setFinish();
            }
        }

        await joinMsg(msg, players,timeToReaction);
        if (players.length == 0)
            return;
        gameStart(msg, cards, players, playToNumber);

        while (!gameIsFinish()) {
            let round = [];
            playerIndex = 0;
            while (playerIndex < players.length) {
                if (gameIsFinish())
                    break;
                if (players[playerIndex].isFinish) {
                    playerIndex += 1;
                    continue;
                };

                const questionMsg = await msg.channel.send("```fix\n" + players[playerIndex].name + ", czy losujesz następną liczbę?```");
                if (players[playerIndex].isBot) {
                    round = bot(msg, players[playerIndex], questionMsg, cards, round);
                    playerIndex += 1;
                    continue;
                }
                await questionMsg.react('✅');
                await questionMsg.react('❌');
                await questionMsg.awaitReactions({ filter, max: 1, time: timeToReaction, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '✅') {
                            const randNumber = getRandomInt(0, cards.length);
                            players[playerIndex].addResult(cards[randNumber].value);
                            round.push({
                                id: players[playerIndex].id,
                                cardName: cards[randNumber].name,
                                cardValue: cards[randNumber].value
                            });
                            playerEndGame();
                        }
                        else { //gracz zareagował ❌
                            msg.channel.send("```diff\n- Gracz " + players[playerIndex].name + " zakończył rozgrywkę```");
                            players[playerIndex].setFinish();
                        }
                    })
                    .catch(err => { //czas na reakcje się skończył
                        msg.channel.send("```diff\n- Gracz " + players[playerIndex].name + " zakończył rozgrywkę ponieważ nie wykonał ruchu```");
                        players[playerIndex].setFinish();
                    });
                playerIndex += 1;
            }
            await roundEndMsg(msg, round, players, playToNumber);
        }
        await resultMsg(msg, players, playToNumber);
    }
}


