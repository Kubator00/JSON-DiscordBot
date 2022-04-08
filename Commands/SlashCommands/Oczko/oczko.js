import joinMsg from "./components/joinMessage.js";
import roundEndMsg from "./components/roundEndMessage.js";
import resultMsg from "./components/resultMessage.js";
import getRandomInt from "../../../Utilities/getRandomInt.js";
import bot from "./components/bot.js";
import gameStart from "./components/gameBeggining.js";
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import loadJSON from "../../../Utilities/loadJSON.js";
import * as path from 'path';

export default {
    name: 'oczko',
    description: "Zagraj w oczko",

    async execute(msg) {
        const playToNumber = 21;
        const timeToReaction = 7000;
        let playerIndex;
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === players[playerIndex].id;
        };
        const cards = loadJSON(path.join(dirname(fileURLToPath(import.meta.url)),'components'),'cards.json');
        let players = [];
        let gameIsFinish = () => {
            for (let player of players)
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
        if (players.length === 0)
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
                }

                const questionMsg = await msg.channel.send("```fix\n" + players[playerIndex].name + ", czy losujesz następną liczbę?```");
                if (players[playerIndex].isBot) {
                    round = await bot(msg, players[playerIndex], questionMsg, cards, round);
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


