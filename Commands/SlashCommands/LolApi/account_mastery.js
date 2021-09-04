const lol_functions = require('./Functions/lol_other_functions.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolKey = require('./Functions/key_lol.js');
const apiLolKey = lolKey.apiLolKey;

module.exports = {
    name: 'mastery',
    description: "Wyświetla statystyki konta i maestire bohaterów z gry Legaue of Legends",
    options: [
        {
            name: "nazwa",
            description: "Nazwa przywoływacza, serwer EUNE",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        let summoner = msg.options.getString('nazwa');
        summonerPlayerName = encodeURI(summoner);
        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolKey;
        const responseSummoner = await fetch(urlSummoner);
        if (responseSummoner.status == 429) {
            msg.followUp("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
            return;
        }
        if (responseSummoner.status != 200) {
            msg.followUp("```diff\n-Nie ma konta o takiej nazwie 🙁\n-Pamiętaj że konto musi znajdować się na serwerze EUNE```");
            return;
        }
        const jsonSummoner = await responseSummoner.json();
        const summonerIdPlayer = jsonSummoner.id;

        const ranks = await lol_functions.read_player_rank_and_stats(summonerIdPlayer);
        if (ranks == -1) {
            msg.followUp("Błąd połączenia");
            lol_functions.lol_error("Pobieranie read_player_rank_and_stats");
            return;
        }


        let player =
        {
            summonerName: jsonSummoner.name,
            summonerLevel: jsonSummoner.summonerLevel,
            profileIconId: jsonSummoner.profileIconId,
            soloqRank: ranks[0],
            flexRank: ranks[1]
        }



        const urlChampionMastery = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerIdPlayer + "?api_key=" + apiLolKey;
        const responseChampionMastery = await fetch(urlChampionMastery);
        if (responseChampionMastery.status != 200) {
            msg.followUp("Błąd połączenia");
            lol_functions.lol_error("Pobieranie champion_mastery");
            return;
        }
        const jsonChampionMastery = await responseChampionMastery.json();

        let numberOfChamp = 20;
        if (jsonChampionMastery.length < numberOfChamp)
            numberOfChamp = jsonChampionMastery.length - 1;

        let championsData = [];
        for (let i = 0; i <= numberOfChamp; i++) {
            let championData = {
                championId: jsonChampionMastery[i].championId,
                championName: "",
                championLevel: jsonChampionMastery[i].championLevel,
                championPoints: jsonChampionMastery[i].championPoints,
                lastPlayTime: new Date(jsonChampionMastery[i].lastPlayTime).toLocaleDateString("pl-PL")
            }
            championsData.push(championData);
        }


        championsData = await lol_functions.read_champion_id(championsData);


        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("Informacje o koncie\n"
                + "●════════════════════════════════════════●",
                'http://ddragon.leagueoflegends.com/cdn/' + await lol_functions.dataDragonVersion + '/img/profileicon/' + player.profileIconId + '.png')

            .setTitle(player.summonerName)
            .setDescription('Poziom: ' + player.summonerLevel)
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                {
                    name: "SoloQ:",
                    value: player.soloqRank,
                    inline: true
                },
                {
                    name: "FlexQ:",
                    value: player.flexRank,
                    inline: true
                },
                {
                    name: '\u200B',
                    value: "```fix\nStatystyki bohaterów: ```",
                    inline: false
                },
                embed_display(championsData)

            )


        msg.followUp({ embeds: [embed] });

    }
}


function embed_display(championsData) {
    let result = [];
    let number = 1;


    for (let i = 1; i < championsData.length; i++) {
        let em = {};
        if (i % 3 == 0) {
            em = {
                name: '\u200B',
                value: '\u200B',
                inline: false
            }
        }
        else {
            em = {
                name: (number) + '.' + embed_display_name(championsData[number - 1]),
                value: embed_display_value(championsData[number - 1]),
                inline: true,
            }
            number += 1;
        }

        result.push(em);
    }
    return result;

}

function embed_display_name(championsData) {
    return (championsData.championName);
}

function embed_display_value(championsData) {
    return ("Maestry: " + championsData.championPoints.toLocaleString('en') + "pkt\n"
        + "Poziom: " + championsData.championLevel +
        "\nOstatnio grany: " + championsData.lastPlayTime);
}