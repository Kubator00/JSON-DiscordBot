const lol_functions = require('./Functions/lol_other_functions.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolKey = require('./Functions/key_lol.js');
const apiLolKey = lolKey.apiLolKey;

module.exports = {
    name: 'live',
    description: "Wyświetla mecz na żywo z gry Legaue of Legends",
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
        if (summoner == 1) { summoner = "Noobmaster69pl"; }
        summonerPlayerName = encodeURI(summoner);
        msg.followUp("```fix\nWyszukiwana obecnej gry \nGracz: " + summoner.toUpperCase() + "\nProszę czekać... ```");

        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolKey;
        const responseSummoner = await fetch(urlSummoner);
        if (responseSummoner.status == 429) {
            msg.channel.send("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
            return;
        }
        if (responseSummoner.status != 200) {
            msg.channel.send("```diff\n-Nie ma konta o takiej nazwie 🙁\n-Pamiętaj że konto musi znajdować się na serwerze EUNE```");
            return;
        }
        const jsonSummoner = await responseSummoner.json();
        const summonerIdPlayer = jsonSummoner.id;

        const urlMatchData = "https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerIdPlayer + "/?api_key=" + apiLolKey;
        const responseMatchData = await fetch(urlMatchData);
        if (responseMatchData.status == 404) {
            msg.channel.send("```diff\n-Obecnie nie znajdujesz się w grze```");
            return;
        }
        if (responseMatchData.status != 200) {
            msg.channel.send("Błąd połączenia");
            lol_functions.lol_error("Pobieranie Match_Data");
            return;
        }
        const jsonMatchData = await responseMatchData.json();


        if (jsonMatchData.gameMode != "CLASSIC" && jsonMatchData.gameMode != "ARAM") {
            msg.channel.send("Przykro mi ale ten tryb gry nie jest obsługiwany");
            return;
        }

        const gameMode = await lol_functions.read_game_mode(jsonMatchData.gameQueueConfigId);
        if (gameMode == -1) {
            msg.channel.send("Błąd połączenia");
            lol_functions.lol_error("Pobieranie game_mode");
            return;
        }


        playersData = [];
        for (const playerNumber in jsonMatchData.participants) {
            let playerData = {
                teamId: jsonMatchData.participants[playerNumber].teamId,
                summonerId: jsonMatchData.participants[playerNumber].summonerId,
                summonerName: jsonMatchData.participants[playerNumber].summonerName,
                summonerLevel: await lol_functions.read_account_level(jsonMatchData.participants[playerNumber].summonerName),
                spell1Id: jsonMatchData.participants[playerNumber].spell1Id,
                spell1Name: "",
                spell2Id: jsonMatchData.participants[playerNumber].spell2Id,
                spell2Name: "",
                championId: jsonMatchData.participants[playerNumber].championId,
                championName: "",
                championMastery: (await lol_functions.read_champion_mastery(jsonMatchData.participants[playerNumber].summonerId, jsonMatchData.participants[playerNumber].championId)).toLocaleString('en'),
                soloqRank: "",
                flexRank: "",
            }
            const ranks = await lol_functions.read_player_rank_and_stats(jsonMatchData.participants[playerNumber].summonerId); //zwraca tablice 2-elementową gdzie element 0 to ranga na soloq a 1 na flexach
            if (ranks == -1) {
                msg.channel.send("Błąd połączenia");
                lol_functions.lol_error("Pobieranie player_rank_and_stats");
                return;
            }
            playerData.soloqRank = ranks[0];
            playerData.flexRank = ranks[1];
            playersData.push(playerData);
        }
        playersData = await lol_functions.read_spells_id(playersData); //do obiektu dodawane są nazwy czarów przywoływacza
        if (playersData == -1) {
            msg.channel.send("Błąd połączenia");
            lol_functions.lol_error("Pobieranie read_spells_id");
            return;
        }
        playersData = await lol_functions.read_champion_id(playersData); // do obiektu dodawane są nazwy postaci
        if (playersData == -1) {
            msg.channel.send("Błąd połączenia");
            lol_functions.lol_error("Pobieranie read_champ_id");
            return;
        }
        let playerIndex;
        for (const playerNumber in playersData) {
            if (summonerIdPlayer == playersData[playerNumber].summonerId) {
                playerIndex = playerNumber;
                break;
            }
        }


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
                {
                    name: '\u200B',
                    value: "```fix\nTwoja drużyna```",
                    inline: true
                },
                {
                    name: '\u200B',
                    value: "```fix\nPrzeciwnicy```",
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
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
            console.log("Blad wyslania embedu z live gra Lola");
        }
    }


};






function embed_display_player_stats(playerData) {
    return ("Czary: " + playerData.spell1Name + ", " + playerData.spell2Name +
        "\nPoziom: " + playerData.summonerLevel +
        "\nMastery: " + playerData.championMastery + "pkt" +
        "\nSoloQ: " + playerData.soloqRank +
        "\nFlexQ: " + playerData.flexRank);
}
