import {MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import * as lolFunctions from './lolCommonFunctions.js'
import fetchHeaders from "./fetchHeaders.js";
import {checkResponseStatusMsg, defaultErrorMsg, sendErrorMsg} from "./lolCommonFunctions.js";


export default async (msg, summoner) => {
    const summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName;

    let responseSummoner;
    try {
        responseSummoner = await fetch(urlSummoner, fetchHeaders);
    } catch (err) {
        msg.channel.send(lolFunctions.defaultErrorMsg).catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }
    if (!checkResponseStatusMsg(responseSummoner.status, msg))
        return;


    const jsonSummoner = await responseSummoner.json();
    const summonerIdPlayer = jsonSummoner.id;

    let ranks;
    try {
        ranks = await lolFunctions.readPlayerRankAndStats(summonerIdPlayer);
    } catch (err) {
        return sendErrorMsg(err, msg);
    }

    let player =
        {
            summonerName: jsonSummoner.name,
            summonerLevel: jsonSummoner.summonerLevel,
            profileIconId: jsonSummoner.profileIconId,
            soloqRank: ranks[0],
            flexRank: ranks[1]
        }

    const urlChampionMastery = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerIdPlayer;
    let responseChampionMastery;
    try {
        responseChampionMastery = await fetch(urlChampionMastery, fetchHeaders);
    } catch (err) {
        return msg.channel.send(defaultErrorMsg).catch(() => console.log("Błąd wysłania wiadomości"));
    }
    if (!checkResponseStatusMsg(responseChampionMastery.status, msg))
        return;

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

    try {
        await lolFunctions.readChampionsName(championsData)
    } catch (err) {
        return sendErrorMsg(err, msg);
    }


    let embed = new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor("Informacje o koncie\n"
            + "●════════════════════════════════════════●",
            'http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.getDragonVersion() + '/img/profileicon/' + player.profileIconId + '.png')

        .setTitle(player.summonerName)
        .setDescription('Poziom: ' + player.summonerLevel)
        .setFooter('🧔 Autor: Kubator')
        .setTimestamp()
        .addFields(embedDisplay(player, championsData))

    try {
        msg.channel.send({embeds: [embed]});
    } catch {
        console.log("Lol Api AccountMastery, Błąd wysłania wiadomości embed");
    }

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