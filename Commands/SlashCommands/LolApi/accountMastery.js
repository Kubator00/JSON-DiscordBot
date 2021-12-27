const lolFunctions = require('./Functions/lolCommonFunctions.js');
const index = require('../../../index.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolToken = require('./Functions/lolToken.js');
const apiLolToken = lolToken.apiLolToken;
const errorNotifications = require('../../../ErrorHandlers/errorHandlers').errorNotifications;
const channelNames = require('../../../Database/readChannelName.js');

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
        const channel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('lol_statistics', msg.guild.id));
        if (channel.id != msg.channel.id) 
            return msg.followUp(`Komenda może być tylko użyta na kanale ${channel.name}`);

        let summoner = msg.options.getString('nazwa');
        summonerPlayerName = encodeURI(summoner);
        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
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

        const ranks = await lolFunctions.read_player_rank_and_stats(summonerIdPlayer);
        if (!ranks) {
            msg.followUp("Błąd połączenia");
            errorNotifications("Lol Api AccountMastery, Błąd pobierania playerRankAndStats");
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



        const urlChampionMastery = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerIdPlayer + "?api_key=" + apiLolToken;
        const responseChampionMastery = await fetch(urlChampionMastery);
        if (responseChampionMastery.status != 200) {
            msg.followUp("Błąd połączenia");
            errorNotifications("Lol Api AccountMastery, Błąd pobierania championMastery");
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


        championsData = await lolFunctions.read_champion_id(championsData);


        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("Informacje o koncie\n"
                + "●════════════════════════════════════════●",
                'http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.dataDragonVersion + '/img/profileicon/' + player.profileIconId + '.png')

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

        try {
            msg.followUp({ embeds: [embed] });
        }
        catch {
            errorNotifications("Lol Api AccountMastery, Błąd wysłania wiadomości embed");
        }

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