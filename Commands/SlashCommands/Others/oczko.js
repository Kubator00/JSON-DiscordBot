const { MessageEmbed } = require('discord.js');
const index = require("../../../index.js");

module.exports = {
    name: 'oczko',
    description: "Zagraj w oczko",

    async execute(msg) {
        const filterFirstMsg = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id != reaction.message.author.id;
        };
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id == players[playerIndex].id;
        };

        let players = [];
        let gameIsFinish = () => {
            for (player of players)
                if (!player.isFinish)
                    return false;
            return true;
        }
        let playerIndex = 0;
        let getNextIndex = () => {
            if (players.length <= playerIndex + 1)
                playerIndex = 0;
            else playerIndex += 1;
        }
        const playToNumber = 21;
        let firstMsg = await msg.followUp("```diff\n+ Osoby które chcą zagrać proszę wcisnąć łapkę w górę```");
        await firstMsg.react('✅');
        await firstMsg.awaitReactions({ filterFirstMsg, max: 5, time: 10000 })
            .then(collected => {
                collected = collected.first();
                for (user of collected.users.cache) {
                    if (user[1].bot)
                        continue;
                    const player = new Player(user[1].id, user[1].username, user[1].avatarURL());
                    players.push(player);
                }
            })
            .catch(err => {
                return msg.channel.send("```diff\n- Brak graczy, gra nie zostanie rozpoczęta```");
            });
        if (players.length == 0)
            return;
        if (players.length == 1)
            addBot(msg, players);



        while (!gameIsFinish()) {
            if (players[playerIndex].isFinish) {
                getNextIndex();
                continue;
            }

            const questionMsg = await msg.channel.send("```fix\n" + players[playerIndex].name + ", czy losujesz następną liczbę?```");
            if (players[playerIndex].isBot) {
                botPlay(msg, players[playerIndex],questionMsg);
                getNextIndex();
                continue;
            }

            await questionMsg.react('✅');
            await questionMsg.react('❌');
            await questionMsg.awaitReactions({ filter, max: 1, time: 10000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        const randomNumber = getRandomInt(4, 8);
                        players[playerIndex].addResult(randomNumber);
                        let embed = new MessageEmbed()
                            .setColor('#ffa500')
                            .setThumbnail(players[playerIndex].avatar)
                            .setTitle(`Gracz ${players[playerIndex].name}`)
                            .setDescription(`Wylosowano liczbę: ${randomNumber}\nObecny wynik: ${players[playerIndex].result}`)
                        msg.channel.send({ embeds: [embed] });
                        if (players[playerIndex].result >= playToNumber) {
                            msg.channel.send("```diff\n- Gracz " + players[playerIndex].name + " zakończył rozgrywkę```")
                            players[playerIndex].setFinish();
                        }
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
            getNextIndex();
        };
        sendResult(msg, players, playToNumber);
    }
}

class Player {
    constructor(playerId, playerName, avatarURL) {
        this.id = playerId;
        this.name = playerName;
        this.avatar = avatarURL;
        this.isBot = false;
        this.result = 0;
        this.isFinish = false;
    }
    addResult(number) {
        this.result += number;
    }
    setFinish() {
        this.isFinish = true;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function botPlay(msg, bot,questionMsg) {
    const max = getRandomInt(15, 18);
    const randomNumber = getRandomInt(4, 8);

    if (max > bot.result) {
        bot.addResult(randomNumber);
        questionMsg.react('✅');
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setThumbnail(bot.avatar)
            .setTitle(`Gracz ${bot.name}`)
            .setDescription(`Wylosowano liczbę: ${randomNumber}\nObecny wynik: ${bot.result}`)
        msg.channel.send({ embeds: [embed] });
    }
    else{
        questionMsg.react('❌');
        msg.channel.send("```diff\n- Gracz " + bot.name + " zakończył rozgrywkę```")
        bot.setFinish();
    }
}

function addBot(msg, players) {
    const bot = new Player(msg.guild.me.user.id, msg.guild.me.user.username, msg.guild.me.user.avatarURL());
    bot.isBot = true;
    players.push(bot);
}


function sendResult(msg, players, playToNumber) {
    let winners = [];
    let min = playToNumber;
    for (player of players) {
        if (playToNumber - player.result >= 0 && min > playToNumber - player.result) {
            min = Math.abs(playToNumber - player.result);
            winners = [];
            winners.push(player.name);
        }
        else if (min == playToNumber - player.result)
            winners.push(player.name);
    }
    let result = "```ini\n[Końcowy rezultat]\n";
    for (player of players)
        result += `${player.name}: ${player.result}pkt\n`

    if (winners.length == 0)
        result += `Brak zwycięzcy, wszyscy gracze przekroczyli próg ${playToNumber}pkt`
    else if (winners.length == 1)
        result += `[Wygrał gracz ${winners[0]}]`;
    else {
        let drawMsg = "[Remis pomiędzmi graczami: ";
        for (winner of winners)
            drawMsg += `${winner} `;
        result += drawMsg;
        result += `]`
    }
    result += "```";
    msg.channel.send(result);
}