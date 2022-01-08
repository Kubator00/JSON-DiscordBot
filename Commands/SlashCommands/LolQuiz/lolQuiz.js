const { MessageEmbed } = require('discord.js');
const index = require("../../../index.js");
const Player = require('./components/player.js');
const loadQuotes = require("./components/loadQuotes.js");
const joinMsg = require("./components/joinMessage.js").joinMsg;
const resultMsg = require("./components/resultMessage.js").resultMsg;
const getRandomInt = require("./components/getRandomInt.js");
const saveStatsToDatabase = require("./components/saveStatsToDatabase.js");
const showStatsFromDatabase = require("./components/showStats.js");


module.exports = {
    name: 'quiz_lol',
    description: "Zagraj w gre zgadując cytaty wypowiedziane przez postacie w League of Legends",
    options: [
        {
            name: "ilosc_rund",
            description: "Liczba pytań od 1 do 20",
            type: "NUMBER",
            required: true
        },
    ],

    async execute(msg) {
        const numberOfRounds = msg.options.getNumber('ilosc_rund');
        if (numberOfRounds < 1 || numberOfRounds > 20)
            return msg.followUp("Liczba rund musi być z przedziału 1:20");

        const timeToReaction = 15000;
        let playerIndex;
        const filter = (a) => {
            return a.author.id == players[playerIndex].id;
        };
        const quotes = loadQuotes();
        let players = [];
        await joinMsg(msg, players, 10000);
        if (players.length == 0)
            return;

        for (let i = 0; i < numberOfRounds; i++) {
            playerIndex = 0;
            while (playerIndex < players.length) {
                const rand = getRandomInt(0, quotes.length);

                const questionEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Pytanie dla ${players[playerIndex].name}`)
                    .addFields(
                        { name: 'Kto wypowiada słowa?', value: quotes[rand].text },
                    )
                const questionMsg = await msg.channel.send({ embeds: [questionEmbed] });

                await questionMsg.channel.awaitMessages({ filter, max: 1, time: timeToReaction, errors: ['time'] })
                    .then(collected => {
                        const answer = collected.first();
                        
                        if (answer.content.toLowerCase() == quotes[rand].name.toLowerCase()) {
                            players[playerIndex].correctAnswers += 1;
                            const answerEmbed = new MessageEmbed()
                            .setColor('#2ECC71')
                            .setTitle(`Poprawna odpowiedź ${players[playerIndex].name}`)
                            .setDescription(`Odpowiedzi poprawne: ${players[playerIndex].correctAnswers}, błędne: ${players[playerIndex].wrongAnswers}`)
                            msg.channel.send({ embeds: [answerEmbed] });
                        }
                        else {
                            players[playerIndex].wrongAnswers += 1;
                            const answerEmbed = new MessageEmbed()
                            .setColor('#E74C3C')
                            .setTitle(`Błędna odpowiedź ${players[playerIndex].name}`)
                            .setDescription(`Odpowiedzi poprawne: ${players[playerIndex].correctAnswers}, błędne: ${players[playerIndex].wrongAnswers}`)
                            .addFields(
                                { name: 'Poprawna odpowiedź to:', value: quotes[rand].name }
                            )
                            msg.channel.send({ embeds: [answerEmbed] });
                        }
                    })
                    .catch(err => { //czas na reakcje się skończył
                        console.log(err);
                        players[playerIndex].wrongAnswers += 1;
                        const answerEmbed = new MessageEmbed()
                        .setColor('#E74C3C')
                        .setTitle(`Gracz ${players[playerIndex].name} nie udzielił odpowiedzi`)
                        .setDescription(`Odpowiedzi poprawne: ${players[playerIndex].correctAnswers}, błędne: ${players[playerIndex].wrongAnswers}`)
                        .addFields(
                            { name: 'Poprawna odpowiedź to:', value: quotes[rand].name }
                        )
                        msg.channel.send({ embeds: [answerEmbed] });
                    });
                playerIndex += 1;
            }
        }
        saveStatsToDatabase(players, msg.guild.id);
        await resultMsg(msg, players);
    }
}


