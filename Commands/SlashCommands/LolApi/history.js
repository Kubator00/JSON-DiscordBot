const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lol_functions = require('./Functions/lolCommonFunctions.js');
const lolToken = require('./Functions/lolToken.js');
const apiLolToken = lolToken.apiLolToken;
const errorNotifications=  require('../../../errorNotifications');
const channelNames = require('../../../channelNames');

module.exports = {
    name: 'historia',
    description: "Wyświetla mecz z League of Legends podany w argumencie",
    options: [
        {
            name: "nr_meczu",
            description: "Numer meczu licząc od ostatniego który chcesz wyświetlić",
            type: "NUMBER",
            required: true
        },
        {
            name: "nazwa",
            description: "Nazwa przywoływacza, serwer EUNE",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        if (msg.channel.name != channelNames.lolChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.lolChannel}`);
            return;
        }

        let summoner = msg.options.getString('nazwa');
        let matchNumber = msg.options.getNumber('nr_meczu') - 1;
        let summonerPlayerName = encodeURI(summoner);

        if (matchNumber < 0 || matchNumber > 19) { //gry możliwe do wyszukania są z tego przedziału
            msg.followUp("W poleceniu wpisano błędą liczbę");
            return;
        }

        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
        const responseSummoner = await fetch(urlSummoner);
        if (responseSummoner.status == 429) {
            msg.followUp("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
            return;
        }
        if (responseSummoner.status != 200) {
            msg.followUp("Nie ma konta o takiej nazwie 🙁\nPamiętaj że konto musi znajdować się na serwerze EUNE");
            return;
        }
        const jsonSummoner = await responseSummoner.json();
        const puuIdPlayer = jsonSummoner["puuid"];
        msg.followUp("```fix\nWyszukiwana gry:  " + (matchNumber + 1) + "\nGracz: " + summoner.toUpperCase() + "\nProszę czekać... ```");

        const urlMatchList = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuIdPlayer + "/ids?start=0&count=20&api_key=" + apiLolToken;
        const responseMatchList = await fetch(urlMatchList);
        if (responseMatchList.status != 200) {
            msg.channel.send("Błąd połączenia");
            errorNotifications("Lol Api History, Błąd pobierania MatchList");
            return;
        }

        const jsonMatchList = await responseMatchList.json();
        const matchId = jsonMatchList[matchNumber];


        const urlMatchData = "https://europe.api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + apiLolToken;
        const responseMatchData = await fetch(urlMatchData);
        if (responseMatchData.status != 200) {
            msg.channel.send("Błąd połączenia");
            errorNotifications("Lol Api History, Błąd pobierania MatchData");
            return;
        }
        const jsonMatchData = await responseMatchData.json();

        if (jsonMatchData.info.gameMode != "CLASSIC" && jsonMatchData.info.gameMode != "ARAM") {
            msg.channel.send("Przykro mi ale ten tryb gry nie jest obsługiwany");
            return;
        }
        if ((jsonMatchData.info.gameDuration) / 60 < 300) { //sprawdzanie czy nie było remake
            msg.channel.send("Gra była za krótka");
            return;
        }
        let matchData =
        {
            gameDuration: Math.ceil(jsonMatchData.info.gameDuration / 1000 / 60) + " min",
            gameMode: await lol_functions.read_game_mode(jsonMatchData.info.queueId),
        }

        if (!matchData.gameMode)  //sprawdzannie czy funkcja game_mode poprawnie pobrała dane
        {
            msg.channel.send("Błąd połączenia");
            errorNotifications("Lol Api History, Błąd pobierania gameMode");
            return;
        }


        playersData = [];
        for (const playerNumber in jsonMatchData.info.participants) {
            let playerData = {
                teamId: jsonMatchData.info.participants[playerNumber].teamId,
                puuId: jsonMatchData.info.participants[playerNumber].puuid,
                summonerName: jsonMatchData.info.participants[playerNumber].summonerName,
                championName: jsonMatchData.info.participants[playerNumber].championName,
                individualPosition: jsonMatchData.info.participants[playerNumber].individualPosition,
                championMastery: await lol_functions.read_champion_mastery(jsonMatchData.info.participants[playerNumber].summonerId, jsonMatchData.info.participants[playerNumber].championId),
                soloqRank: "",
                flexRank: "",
                summonerLevel: jsonMatchData.info.participants[playerNumber].summonerLevel,
                kills: jsonMatchData.info.participants[playerNumber].kills,
                assists: jsonMatchData.info.participants[playerNumber].assists,
                deaths: jsonMatchData.info.participants[playerNumber].deaths,
                totalMinionsKilled: jsonMatchData.info.participants[playerNumber].totalMinionsKilled + jsonMatchData.info.participants[playerNumber].neutralMinionsKilled,
                totalMinionsKilledPerMinute: Math.round((jsonMatchData.info.participants[playerNumber].totalMinionsKilled + jsonMatchData.info.participants[playerNumber].neutralMinionsKilled) / (jsonMatchData.info.gameDuration / 1000 / 60) * 10) / 10,
                goldEarned: jsonMatchData.info.participants[playerNumber].goldEarned,
                largestMultiKill: jsonMatchData.info.participants[playerNumber].largestMultiKill,
                totalDamageDealtToChampions: jsonMatchData.info.participants[playerNumber].totalDamageDealtToChampions,
                visionScore: jsonMatchData.info.participants[playerNumber].visionScore,
                visionWardsBoughtInGame: jsonMatchData.info.participants[playerNumber].visionWardsBoughtInGame,
            }
            //sprawdzannie czy funkcja champion_mastery poprawnie pobrała dane
            if (!playerData.championMastery) {
                msg.channel.send("Błąd połączenia");
                errorNotifications("Lol Api History, Błąd pobierania championMastery");
                return;
            }
            // ragi przypisuje w ten sposób aby było mniej zapytań
            let playerRanks = await lol_functions.read_player_rank(jsonMatchData.info.participants[playerNumber].summonerId);
            //sprawdzanie czy funkcja player_rank poprawnie pobrała dane
            if (!playerRanks) {
                msg.channel.send("Błąd połączenia");
                errorNotifications("Lol Api History, Błąd pobierania playerRanks");
                return;
            }
            playerData.soloqRank = playerRanks[0];
            playerData.flexRank = playerRanks[1];

            playersData.push(playerData);
        }

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
        //sortowanie według pozycji
        if (jsonMatchData.info.gameMode != "ARAM") { //na Aramie nie sortuje
            // nazwe każdej pozycji zamieniam na jej wartość liczbową aby móc to posortować
            for (const playerNumber in playersData) {
                if (playersData[playerNumber].individualPosition == "TOP")
                    playersData[playerNumber].individualPosition = 1;
                else if (playersData[playerNumber].individualPosition == "JUNGLE")
                    playersData[playerNumber].individualPosition = 2;
                else if (playersData[playerNumber].individualPosition == "MIDDLE")
                    playersData[playerNumber].individualPosition = 3;
                else if (playersData[playerNumber].individualPosition == "BOTTOM")
                    playersData[playerNumber].individualPosition = 4;
                else if (playersData[playerNumber].individualPosition == "UTILITY")
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
            // console.log(playersData);
            // sortuje rosnąco pozycje drugiej drużyny
            for (let i = playersData.length / 2; i < playersData.length - 1; i++) {
                for (let j = playersData.length / 2; j < playersData.length - 1; j++) {
                    if (playersData[j].individualPosition > playersData[j + 1].individualPosition)
                        [playersData[j], playersData[j + 1]] = [playersData[j + 1], playersData[j]];
                }
            }

        }

        let playerIndex; //zmienna przechowująca pozycje gracza który szuka gry w celu ustalenia w której jest drużynie oraz wyniku meczu
        for (const playerNumber in playersData) {
            if (puuIdPlayer == playersData[playerNumber].puuId) {
                playerIndex = playerNumber;
                break;
            }
        }

        let matchResult; //sprawdzanie czy gracz który szuka gry ją wygrał czy przegrał
        if ((playerIndex < 5 && teamsData[0].win == true) || (playerIndex > 4 && teamsData[1].win == true))
            matchResult = "ZWYCIĘSTWO ✅";
        else
            matchResult = "PORAŻKA ❌";


        if (playerIndex >= playersData.length / 2) //jeśli drużyna gracza jest po prawej stronie to przesuwamy ją na lewo a przeciwników na prawo
        {
            for (let i = 0; i < playersData.length / 2; i++) {
                [playersData[i], playersData[i + playersData.length / 2]] = [playersData[i + playersData.length / 2], playersData[i]];
            }
            playerIndex -= playersData.length / 2;

            [teamsData[0], teamsData[1]] = [teamsData[1], teamsData[0]];
        }


        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle(matchResult)
            .setAuthor(matchData.gameMode + "\n" +
                "●═══════════════════════════════════════════════●")
            .setDescription('🕧 Długość gry: ' + matchData.gameDuration)
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                {
                    name: '\u200B',
                    value:
                        /// ```fix zmienia kolor tekstu
                        "```fix\nTwoja drużyna```\n" +
                        "KDA: " + teamsData[0].kills + " / " + teamsData[0].deaths + " / " + teamsData[0].assists +
                        "\nIlość złota: " + teamsData[0].goldEarned +
                        " g\nWizja: " + teamsData[0].visionScore +
                        " pkt\nCS: " + teamsData[0].totalMinionsKilled +
                        "\nZniszczone wieże: " + teamsData[0].towerKills +
                        "\nZniszczone inhibitory: " + teamsData[0].inhibitorsKills +
                        "\nZabite barony: " + teamsData[0].baronKills +
                        "\nZabite smoki: " + teamsData[0].dragonKills +
                        "\nZabite heraldy: " + teamsData[0].heraldKills,
                    inline: true
                },
                {
                    name: '\u200B',
                    value:
                        "```fix\nPrzeciwnicy```\n" +
                        "KDA: " + teamsData[1].kills + " / " + teamsData[1].deaths + " / " + teamsData[1].assists +
                        "\nIlość złota: " + teamsData[1].goldEarned +
                        " g\nWizja: " + teamsData[1].visionScore +
                        " pkt\nCS: " + teamsData[1].totalMinionsKilled +
                        "\nZniszczone wieże: " + teamsData[1].towerKills +
                        "\nZniszczone inhibitory: " + teamsData[1].inhibitorsKills +
                        "\nZabite barony: " + teamsData[1].baronKills +
                        "\nZabite smoki: " + teamsData[1].dragonKills +
                        "\nZabite heraldy: " + teamsData[1].heraldKills,
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '```fix\nStatystyki graczy:```',
                    inline: false
                },

                {
                    name: lol_functions.embed_display_name(playersData[0]),
                    value: embed_display_player_stats(playersData[0]),
                    inline: true
                },
                {
                    name: lol_functions.embed_display_name(playersData[5]),
                    value: embed_display_player_stats(playersData[5]),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: lol_functions.embed_display_name(playersData[1]),
                    value: embed_display_player_stats(playersData[1]),
                    inline: true
                },
                {
                    name: lol_functions.embed_display_name(playersData[6]),
                    value: embed_display_player_stats(playersData[6]),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: lol_functions.embed_display_name(playersData[2]),
                    value: embed_display_player_stats(playersData[2]),
                    inline: true
                },
                {
                    name: lol_functions.embed_display_name(playersData[7]),
                    value: embed_display_player_stats(playersData[7]),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: lol_functions.embed_display_name(playersData[3]),
                    value: embed_display_player_stats(playersData[3]),
                    inline: true
                },
                {
                    name: lol_functions.embed_display_name(playersData[8]),
                    value: embed_display_player_stats(playersData[8]),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: lol_functions.embed_display_name(playersData[4]),
                    value: embed_display_player_stats(playersData[4]),
                    inline: true
                },
                {
                    name: lol_functions.embed_display_name(playersData[9]),
                    value: embed_display_player_stats(playersData[9]),
                    inline: true
                },

            )
        try {
            msg.channel.send({ embeds: [embed] });
        }
        catch {
            errorNotifications("Lol Api History, Błąd wysłania wiadomości embed");
        }

    }

};



function embed_display_player_stats(playerData) {
    let mastery, goldEarned, totalDamageDealtToChampions;
    try { mastery = playerData.championMastery.toLocaleString('en') + "pkt"; }
    catch { mastery = "BLAD"; }
    try { goldEarned = playerData.goldEarned.toLocaleString('en') + " g"; }
    catch { goldEarned = "BLAD"; }
    try { totalDamageDealtToChampions = playerData.totalDamageDealtToChampions.toLocaleString('en'); }
    catch { totalDamageDealtToChampions = "BLAD"; }

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




