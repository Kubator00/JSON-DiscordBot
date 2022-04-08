import {MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import * as lolFunctions from './lolCommonFunctions.js'
import apiLolToken from './lolToken.js'




export default async (msg, summoner) => {
    const summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
    let responseSummoner;
    try {
        responseSummoner = await fetch(urlSummoner);
    } catch (err) {
        msg.channel.send("Wystąpił błąd połączenia z serwerem").catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    try {
        lolFunctions.checkResponseStatus(responseSummoner.status);
    } catch (err) {
        msg.channel.send(err.message).catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    const jsonSummoner = await responseSummoner.json();
    const summonerIdPlayer = jsonSummoner.id;

    const urlMatchData = "https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerIdPlayer + "/?api_key=" + apiLolToken;
    let responseMatchData;
    try {
        responseMatchData = await fetch(urlMatchData);
    }catch(err){
        msg.channel.send("Błąd łączenia z serwerem").catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    if (responseMatchData.status == 404) {
        msg.channel.send("```diff\n-Obecnie nie znajdujesz się w grze```").catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }
    try {
        lolFunctions.checkResponseStatus(responseSummoner.status);
    } catch (err) {
        msg.channel.send(err.message).catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    const jsonMatchData = await responseMatchData.json();
    if (jsonMatchData.gameMode != "CLASSIC" && jsonMatchData.gameMode != "ARAM") {
        msg.channel.send("Przykro mi ale ten tryb gry nie jest obsługiwany").catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    let gameMode, playersData;
    try {
        playersData = await fetchPlayers(jsonMatchData);
        gameMode = await lolFunctions.readGameMode(jsonMatchData.gameQueueConfigId);
        await lolFunctions.readSpellsName(playersData);
        await lolFunctions.readChampionsName(playersData); // do obiektu dodawane są nazwy postaci
    } catch (err) {
        msg.channel.send(err.message).catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }

    let playerIndex = playersData.findIndex(p => p.summonerId === summonerIdPlayer);
    if (playerIndex >= playersData.length / 2) //jeśli drużyna gracza jest po prawej stronie to przesuwamy ją na lewo a przeciwników na prawo
    {
        for (let i = 0; i < playersData.length / 2; i++) {
            [playersData[i], playersData[i + playersData.length / 2]] = [playersData[i + playersData.length / 2], playersData[i]];
        }
        playerIndex -= playersData.length / 2;
    }

    let embed = new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor(gameMode + "\n" +
            "●═══════════════════════════════════════════════●")
        .setDescription('⏳ Gra na żywo')
        .setFooter('🧔 Autor: Kubator')
        .setTimestamp()
        .addFields(
            embedFields(playersData)
        )

    try {
        msg.channel.send({ embeds: [embed] });
    } catch {
        console.log("Błąd wysłania wiadomości").catch(() => console.log("Błąd wysłania wiadomości"));
    }
};

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
            throw "Błąd pobierania danych z serwera"
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

