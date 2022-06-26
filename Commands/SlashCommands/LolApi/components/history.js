import {MessageEmbed} from "discord.js";
import * as lolFunctions from './lolCommonFunctions.js'
import fetchHeaders from "./fetchHeaders.js";
import {  LolError} from "./lolCommonFunctions.js";
import fetchData from "./fetchData.js";


export default async (summoner, matchNumber) => {
    matchNumber -= 1;
    try {
        if (matchNumber < 0 || matchNumber > 19) //gry możliwe do wyszukania są z tego przedziału
            throw new LolError('W poleceniu wpisano błędą liczbę');
    } catch (err) {
        throw err;
    }

    let summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName;
    let responseSummoner;
    try {
        responseSummoner = await fetchData(urlSummoner, fetchHeaders);
    } catch (err) {
        throw err;
    }

    const jsonSummoner = await responseSummoner.json();
    const puuIdPlayer = jsonSummoner["puuid"];
    const urlMatchList = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuIdPlayer + "/ids?start=0&count=20";
    let responseMatchList;
    try {
        responseMatchList = await fetchData(urlMatchList, fetchHeaders);
    } catch (err) {
        throw err;
    }

    const jsonMatchList = await responseMatchList.json();
    const matchId = jsonMatchList[matchNumber];
    const urlMatchData = "https://europe.api.riotgames.com/lol/match/v5/matches/" + matchId;
    let responseMatchData;
    try {
        responseMatchData = await fetchData(urlMatchData, fetchHeaders);
    } catch (err) {
        throw err;
    }

    const jsonMatchData = await responseMatchData.json();
    try {
        if (jsonMatchData.info.gameMode !== "CLASSIC" && jsonMatchData.info.gameMode !== "ARAM")
            throw new LolError('Tryb gry nie jest obsługiwany');
        if ((jsonMatchData.info.gameDuration) < 300)  //sprawdzanie czy nie było remake
            throw new LolError('Gra była za krótka');
    } catch (err) {
        throw err;
    }

    const gameDuration = Math.ceil(jsonMatchData.info.gameDuration / 60) + " min";
    let gameMode;
    try {
        gameMode = await lolFunctions.readGameMode(jsonMatchData.info.queueId)
    } catch (err) {
        throw err;
    }
    let playersData;
    try {
        playersData = await fetchPlayers(jsonMatchData);
    } catch (err) {
        throw err;
    }
    if (jsonMatchData.info.gameMode !== "ARAM")
        sortPlayers(playersData);

    const playerIndex = playersData.findIndex(p => p.puuId === puuIdPlayer);
    const teamsData = fetchTeams(jsonMatchData, playersData);
    const matchResult = setMatchResult(playerIndex, teamsData);
    shiftPlayerTeamToLeftSide(playersData, teamsData, playerIndex);

    return createEmbed(matchResult, gameMode, gameDuration, teamsData, playersData);
}
const setMatchResult = (playerIndex, teamsData) => {
    let matchResult = "PORAŻKA ❌";
    if ((playerIndex < 5 && teamsData[0].win === true) || (playerIndex > 4 && teamsData[1].win === true))
        matchResult = "ZWYCIĘSTWO ✅";
    return matchResult;
}

const createEmbed = (matchResult, gameMode, gameDuration, teamsData, playersData) => {
    return new MessageEmbed()
        .setColor('#ffa500')
        .setTitle(matchResult)
        .setAuthor({name: `${gameMode}\n●═══════════════════════════════════════════════●`})
        .setDescription('🕧 Długość gry: ' + gameDuration)
        .setTimestamp()
        .addFields(
            embedTeamsField(teamsData),
            {
                name: '\u200B',
                value: '```fix\nStatystyki graczy:```',
                inline: false
            },
            embedPlayersField(playersData),
        )

}


async function fetchPlayers(jsonMatchData) {
    let playersData = [];
    for (const playerNumber in jsonMatchData.info.participants) {
        let playerData = {};
        try {
            playerData = {
                teamId: jsonMatchData.info.participants[playerNumber].teamId,
                puuId: jsonMatchData.info.participants[playerNumber].puuid,
                summonerName: jsonMatchData.info.participants[playerNumber].summonerName,
                championName: jsonMatchData.info.participants[playerNumber].championName,
                individualPosition: jsonMatchData.info.participants[playerNumber].individualPosition,
                championMastery: await lolFunctions.readChampionMastery(jsonMatchData.info.participants[playerNumber].summonerId, jsonMatchData.info.participants[playerNumber].championId),
                soloqRank: "",
                flexRank: "",
                summonerLevel: jsonMatchData.info.participants[playerNumber].summonerLevel,
                kills: jsonMatchData.info.participants[playerNumber].kills,
                assists: jsonMatchData.info.participants[playerNumber].assists,
                deaths: jsonMatchData.info.participants[playerNumber].deaths,
                totalMinionsKilled: jsonMatchData.info.participants[playerNumber].totalMinionsKilled + jsonMatchData.info.participants[playerNumber].neutralMinionsKilled,
                totalMinionsKilledPerMinute: Math.round((jsonMatchData.info.participants[playerNumber].totalMinionsKilled + jsonMatchData.info.participants[playerNumber].neutralMinionsKilled) / (jsonMatchData.info.gameDuration / 60) * 10) / 10,
                goldEarned: jsonMatchData.info.participants[playerNumber].goldEarned,
                largestMultiKill: jsonMatchData.info.participants[playerNumber].largestMultiKill,
                totalDamageDealtToChampions: jsonMatchData.info.participants[playerNumber].totalDamageDealtToChampions,
                visionScore: jsonMatchData.info.participants[playerNumber].visionScore,
                visionWardsBoughtInGame: jsonMatchData.info.participants[playerNumber].visionWardsBoughtInGame,
            }
            let playerRanks = await lolFunctions.readPlayerRank(jsonMatchData.info.participants[playerNumber].summonerId);
            playerData.soloqRank = playerRanks[0];
            playerData.flexRank = playerRanks[1];
        } catch (err) {
            console.error(err);
            throw new LolError("Błąd pobierania danych z serwera");
        }
        playersData.push(playerData);
    }
    return playersData;
}

function sortPlayers(playersData) {
    //sortowanie według pozycji
    // nazwe każdej pozycji zamieniam na jej wartość liczbową aby móc to posortować
    for (const playerNumber in playersData) {
        if (playersData[playerNumber].individualPosition === "TOP")
            playersData[playerNumber].individualPosition = 1;
        else if (playersData[playerNumber].individualPosition === "JUNGLE")
            playersData[playerNumber].individualPosition = 2;
        else if (playersData[playerNumber].individualPosition === "MIDDLE")
            playersData[playerNumber].individualPosition = 3;
        else if (playersData[playerNumber].individualPosition === "BOTTOM")
            playersData[playerNumber].individualPosition = 4;
        else if (playersData[playerNumber].individualPosition === "UTILITY")
            playersData[playerNumber].individualPosition = 5;
        else
            playersData[playerNumber].individualPosition = 6;
    }


    // sortuje rosnąco pozycje piewszej drużyny
    for (let i = 0; i < playersData.length / 2 - 1; i++) {
        for (let j = 0; j < playersData.length / 2 - 1; j++) {
            if (playersData[j].individualPosition > playersData[j + 1].individualPosition)
                [playersData[j], playersData[j + 1]] = [playersData[j + 1], playersData[j]];
        }
    }

    // sortuje rosnąco pozycje drugiej drużyny
    for (let i = playersData.length / 2; i < playersData.length - 1; i++) {
        for (let j = playersData.length / 2; j < playersData.length - 1; j++) {
            if (playersData[j].individualPosition > playersData[j + 1].individualPosition)
                [playersData[j], playersData[j + 1]] = [playersData[j + 1], playersData[j]];
        }
    }


}

function shiftPlayerTeamToLeftSide(playersData, teamsData, playerIndex) {

    if (playerIndex >= playersData.length / 2) //jeśli drużyna gracza jest po prawej stronie to przesuwamy ją na lewo a przeciwników na prawo
    {
        for (let i = 0; i < playersData.length / 2; i++) {
            [playersData[i], playersData[i + playersData.length / 2]] = [playersData[i + playersData.length / 2], playersData[i]];
        }
        playerIndex -= playersData.length / 2;

        [teamsData[0], teamsData[1]] = [teamsData[1], teamsData[0]];
    }

}

function fetchTeams(jsonMatchData, playersData) {
    let teamsData = [
        {
            teamId: 100,
            kills: 0,
            deaths: 0,
            assists: 0,
            goldEarned: 0,
            totalMinionsKilled: 0,
            visionScore: 0,
            towerKills: jsonMatchData.info.teams[0].objectives.tower.kills,
            inhibitorsKills: jsonMatchData.info.teams[0].objectives.inhibitor.kills,
            dragonKills: jsonMatchData.info.teams[0].objectives.dragon.kills,
            heraldKills: jsonMatchData.info.teams[0].objectives.riftHerald.kills,
            baronKills: jsonMatchData.info.teams[0].objectives.baron.kills,
            totalDamageDealtToChampions: 0,
            win: jsonMatchData.info.teams[0].win,

        },
        {
            teamId: 200,
            kills: 0,
            deaths: 0,
            assists: 0,
            goldEarned: 0,
            totalMinionsKilled: 0,
            visionScore: 0,
            towerKills: jsonMatchData.info.teams[1].objectives.tower.kills,
            inhibitorsKills: jsonMatchData.info.teams[1].objectives.inhibitor.kills,
            dragonKills: jsonMatchData.info.teams[1].objectives.dragon.kills,
            heraldKills: jsonMatchData.info.teams[1].objectives.riftHerald.kills,
            baronKills: jsonMatchData.info.teams[1].objectives.baron.kills,
            totalDamageDealtToChampions: 0,
            win: jsonMatchData.info.teams[1].win,

        }
    ];

    for (const playerNumber in playersData) {
        let index;
        if (playersData[playerNumber].teamId == 100)
            index = 0;
        else
            index = 1;

        teamsData[index].kills += playersData[playerNumber].kills;
        teamsData[index].deaths += playersData[playerNumber].deaths;
        teamsData[index].assists += playersData[playerNumber].assists;
        teamsData[index].goldEarned += playersData[playerNumber].goldEarned;
        teamsData[index].totalDamageDealtToChampions += playersData[playerNumber].totalDamageDealtToChampions;
        teamsData[index].totalMinionsKilled += playersData[playerNumber].totalMinionsKilled;
        teamsData[index].visionScore += playersData[playerNumber].visionScore;
    }

    return teamsData;
}

function embedTeamsField(teamsData) {
    let result = [];
    for (let i = 0; i < 2; i++) {
        result.push({
            name: '\u200B',
            value:
            /// ```fix zmienia kolor tekstu
                "```fix\nTwoja drużyna```\n" +
                "KDA: " + teamsData[i].kills + " / " + teamsData[i].deaths + " / " + teamsData[i].assists +
                "\nIlość złota: " + teamsData[i].goldEarned +
                " g\nWizja: " + teamsData[i].visionScore +
                " pkt\nCS: " + teamsData[i].totalMinionsKilled +
                "\nZniszczone wieże: " + teamsData[i].towerKills +
                "\nZniszczone inhibitory: " + teamsData[i].inhibitorsKills +
                "\nZabite barony: " + teamsData[i].baronKills +
                "\nZabite smoki: " + teamsData[i].dragonKills +
                "\nZabite heraldy: " + teamsData[i].heraldKills,
            inline: true
        })
    }
    return result;
}

function embedPlayersField(playersData) {
    const result = [
        {
            name: '\u200B',
            value: "```fix\nTwoja drużyna```",
            inline: true
        },
        {
            name: '\u200B',
            value: "```fix\nPrzeciwnicy```",
            inline: true
        }];
    for (let i = 0; i < playersData.length / 2; i++) {
        result.push(
            {
                name: '\u200B',
                value: '\u200B',
                inline: false
            },
            {
                name: lolFunctions.embedDisplayName(playersData[i]),
                value: embedDisplayPlayerStats(playersData[i]),
                inline: true
            },
            {
                name: lolFunctions.embedDisplayName(playersData[i + 5]),
                value: embedDisplayPlayerStats(playersData[i + 5]),
                inline: true
            },
        )
    }
    return result;
}

function embedDisplayPlayerStats(playerData) {
    let mastery, goldEarned, totalDamageDealtToChampions;
    try {
        mastery = playerData.championMastery.toLocaleString('en') + "pkt";
    } catch {
        mastery = "BLAD";
    }
    try {
        goldEarned = playerData.goldEarned.toLocaleString('en') + " g";
    } catch {
        goldEarned = "BLAD";
    }
    try {
        totalDamageDealtToChampions = playerData.totalDamageDealtToChampions.toLocaleString('en');
    } catch {
        totalDamageDealtToChampions = "BLAD";
    }

    return ("KDA: " + playerData.kills + " / " + playerData.deaths + " / " + playerData.assists +
        "\nMastery: " + mastery +
        "\nKonto: " + playerData.summonerLevel + " lvl" +
        "\nSoloQ: " + playerData.soloqRank +
        "\nFlexQ: " + playerData.flexRank +
        "\nCs: " + playerData.totalMinionsKilled +
        "\nCs na minute: " + playerData.totalMinionsKilledPerMinute +
        "\nWizja: " + playerData.visionScore +
        "\nKupione pinki: " + playerData.visionWardsBoughtInGame +
        "\nNajwiększe wielobójstwo: " + playerData.largestMultiKill +
        "\nZdobyte złoto: " + goldEarned +
        "\nZadane obrażenia: " + totalDamageDealtToChampions);


}



