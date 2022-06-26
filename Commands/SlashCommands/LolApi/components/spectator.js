import {MessageEmbed} from "discord.js";
import * as lolFunctions from './lolCommonFunctions.js'
import fetchHeaders from "./fetchHeaders.js";
import {defaultErrorMsg, LolError} from "./lolCommonFunctions.js";
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
    const urlMatchData = "https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerIdPlayer;
    let responseMatchData;
    try {
        responseMatchData = await fetchData(urlMatchData, fetchHeaders);
    } catch (err) {
        throw new LolError("```diff\n-Obecnie nie znajdujesz się w grze```");
    }
    const jsonMatchData = await responseMatchData.json();
    try {
        if (jsonMatchData.gameMode !== "CLASSIC" && jsonMatchData.gameMode !== "ARAM")
            throw new LolError('Tryb gry nie jest obsługiwany');
    } catch (err) {
        console.error(err);
        throw err;
    }
    let gameMode, playersData;
    try {
        playersData = await fetchPlayers(jsonMatchData);
        gameMode = await lolFunctions.readGameMode(jsonMatchData.gameQueueConfigId);
        await lolFunctions.readSpellsName(playersData);
        await lolFunctions.readChampionsName(playersData);
    } catch (err) {
        console.error(err);
        throw err;
    }
    shiftTeamsPosition(playersData, summonerIdPlayer);
    return createEmbed(gameMode, playersData);
}


const createEmbed = (gameMode, playersData) => {
    return new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor({name: `${gameMode}\n ●═══════════════════════════════════════════════●`})
        .setDescription('⏳ Gra na żywo')
        .setTimestamp()
        .addFields(
            embedFields(playersData)
        )
}

async function fetchPlayers(jsonMatchData) {
    let playersData = [];
    for (const playerNumber in jsonMatchData.participants) {
        let playerData = {};
        try {
            playerData = {
                teamId: jsonMatchData.participants[playerNumber].teamId,
                summonerId: jsonMatchData.participants[playerNumber].summonerId,
                summonerName: jsonMatchData.participants[playerNumber].summonerName,
                summonerLevel: await lolFunctions.readAccountLevel(jsonMatchData.participants[playerNumber].summonerName),
                spell1Id: jsonMatchData.participants[playerNumber].spell1Id,
                spell1Name: "",
                spell2Id: jsonMatchData.participants[playerNumber].spell2Id,
                spell2Name: "",
                championId: jsonMatchData.participants[playerNumber].championId,
                championName: "",
                championMastery: (await lolFunctions.readChampionMastery(jsonMatchData.participants[playerNumber].summonerId, jsonMatchData.participants[playerNumber].championId)).toLocaleString('en'),
                soloqRank: "",
                flexRank: "",
            }

            const ranks = await lolFunctions.readPlayerRankAndStats(jsonMatchData.participants[playerNumber].summonerId); //zwraca tablice 2-elementową gdzie element 0 to ranga na soloq a 1 na flexach
            playerData.soloqRank = ranks[0];
            playerData.flexRank = ranks[1];
        } catch (err) {
            console.log(err);
            throw new LolError(defaultErrorMsg);
        }
        playersData.push(playerData);
    }
    return playersData;
}


function embedFields(playersData) {
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
        }]
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
    return ("Czary: " + playerData.spell1Name + ", " + playerData.spell2Name +
        "\nPoziom: " + playerData.summonerLevel +
        "\nMastery: " + playerData.championMastery + "pkt" +
        "\nSoloQ: " + playerData.soloqRank +
        "\nFlexQ: " + playerData.flexRank);
}

const shiftTeamsPosition = (playersData, summonerIdPlayer) => {
    let playerIndex = playersData.findIndex(p => p.summonerId === summonerIdPlayer);
    if (playerIndex >= playersData.length / 2) //jeśli drużyna gracza jest po prawej stronie to przesuwamy ją na lewo a przeciwników na prawo
    {
        for (let i = 0; i < playersData.length / 2; i++) {
            [playersData[i], playersData[i + playersData.length / 2]] = [playersData[i + playersData.length / 2], playersData[i]];
        }
    }
}