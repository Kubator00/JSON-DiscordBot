import {MessageEmbed} from "discord.js";
import * as lolFunctions from './lolCommonFunctions.js'
import fetchHeaders from "./fetchHeaders.js";
import fetchData from "./fetchData.js";


export default async (summoner) => {
    const summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName;
    let responseSummoner;
    try {
        responseSummoner = await fetchData(urlSummoner, fetchHeaders);
    } catch (err) {
        throw err;
    }
    const jsonSummoner = await responseSummoner.json();
    const summonerIdPlayer = jsonSummoner.id;
    let ranks;
    try {
        ranks = await lolFunctions.readPlayerRankAndStats(summonerIdPlayer);
    } catch (err) {
        throw err;
    }
    const player = setPlayer(jsonSummoner, ranks);
    const urlChampionMastery = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerIdPlayer;
    let responseChampionMastery;
    try {
        responseChampionMastery = await fetchData(urlChampionMastery, fetchHeaders);
    } catch (err) {
        throw err;
    }
    const jsonChampionMastery = await responseChampionMastery.json();
    let championsData = setChampions(jsonChampionMastery);
    try {
        await lolFunctions.readChampionsName(championsData)
    } catch (err) {
        throw err;
    }
    return createEmbed(player, championsData);
}

function setPlayer(jsonSummoner, ranks) {
    return {
        summonerName: jsonSummoner.name,
        summonerLevel: jsonSummoner.summonerLevel,
        profileIconId: jsonSummoner.profileIconId,
        soloqRank: ranks[0],
        flexRank: ranks[1]
    }
}

function setChampions(jsonChampionMastery) {
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
    return championsData;
}

async function createEmbed(player, championsData) {
    return new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor({
            name: `Informacje o koncie\n ●════════════════════════════════════════●`,
            iconURL: 'http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.getDragonVersion() + '/img/profileicon/' + player.profileIconId + '.png'
        })
        .setTitle(player.summonerName)
        .setDescription('Poziom: ' + player.summonerLevel)
        .setTimestamp()
        .addFields(embedDisplay(player, championsData))
}

function embedDisplay(player, championsData) {
    let result = [
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
    ];
    let number = 1;


    for (let i = 1; i < championsData.length; i++) {
        let em = {};
        if (i % 3 === 0) {
            em = {
                name: '\u200B',
                value: '\u200B',
                inline: false
            }
        } else {
            em = {
                name: (number) + '.' + embedDisplayName(championsData[number - 1]),
                value: embedDisplayValue(championsData[number - 1]),
                inline: true,
            }
            number += 1;
        }

        result.push(em);
    }
    return result;

}

function embedDisplayName(championsData) {
    return (championsData.championName);
}

function embedDisplayValue(championsData) {
    return ("Maestry: " + championsData.championPoints.toLocaleString('en') + "pkt\n"
        + "Poziom: " + championsData.championLevel +
        "\nOstatnio grany: " + championsData.lastPlayTime);
}