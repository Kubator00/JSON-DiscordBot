const lol_functions = require('./Functions/lol_other_functions.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolKey = require('./Functions/key_lol.js');
const apiLolKey = lolKey.apiLolKey;

module.exports = {
    name: 'historia',
    description: "WYŚWIETLA GRĘ NA ŻYWO Z LEAGUE OF LEGENDS",
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
        let summoner = msg.options.getString('nazwa');
        let nr_match = msg.options.getNumber('nr_meczu');
        summoner = encodeURI(summoner);
        let url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner + "/?api_key=" + apiLolKey;
        let response = await fetch(url);
        let json = await response.json();
        if (nr_match < 0 || nr_match > 20) {
            msg.followUp("W poleceniu wpisano błędą liczbę")
            return -1;
        }
        if (json['name'] == undefined) { //blad polaczenia lub nie istnieje taka nazwa
            msg.followUp("Nie ma konta o takiej nazwie 🙁\nPamiętaj że konto musi znajdować się na serwerze EUNE")
            return -1;
        }
        let account_id = json['accountId'];

        url = "https://eun1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + account_id + "/?api_key=" + apiLolKey;
        response = await fetch(url);
        json = await response.json();
        if (json['matches'] == undefined) { //blad polaczenia lub nie istnieje taka nazwa
            msg.followUp("Błąd połączenia");
            return -1;
        }

        let game_id = json['matches'][nr_match]['gameId'];
        let champ_id_player = json['matches'][nr_match]['champion'];

        url = "https://eun1.api.riotgames.com/lol/match/v4/matches/" + game_id + "/?api_key=" + apiLolKey;
        response = await fetch(url);
        json = await response.json();
        if (json['gameMode'] == undefined) {
            msg.followUp("Błąd połączenia");
            return -1;
        }
        let map = json['gameMode'];
        if (map != 'CLASSIC' && map != 'ARAM') {
            msg.followUp("Nieobslugiwany tryb gry");
            return -1;
        }
        let game_duration = json['gameDuration'];
        if (game_duration < 300) {
            console.log("Gra byla za krotka");
            return -1;
        }
        let queueID = json['queueId'];

        //dane o danej druzynie 
        let team = [];
        for (var i = 0; i < 2; i++) {
            team[i] = [json['teams'][i]['teamId'], //0
            json['teams'][i]['win'], //1
            json['teams'][i]['firstBlood'], //2
            json['teams'][i]['firstTower'], //3 
            json['teams'][i]['firstInhibitor'], //4
            json['teams'][i]['firstBaron'], //5 
            json['teams'][i]['firstDragon'], //6 
            json['teams'][i]['firstRiftHerald'], //7 
            json['teams'][i]['inhibitorKills'], //8 
            json['teams'][i]['towerKills'], //9 
            json['teams'][i]['baronKills'], //10 
            json['teams'][i]['dragonKills'], //11
            json['teams'][i]['riftHeraldKills'], //12

            ];

        }
        //tlumaczenie na polski
        for (var i = 0; i < 2; i++) {
            for (var j = 1; j < 8; j++) {
                if (team[i][j] == "Fail")
                    team[i][j] = "Porażka";
                if (team[i][j] == "Win")
                    team[i][j] = "Zwycięstwo";
                if (team[i][j] == false)
                    team[i][j] = "nie";
                if (team[i][j] == true)
                    team[i][j] = "tak";


            }
        }
        // console.log(team);
        // console.log(game_duration);
        // console.log(queueID);

        //dane graczy w meczu
        let player = [];
        let player_index = 0;

        for (var i = 0; i < 10; i++) {
            player[i] = [json['participantIdentities'][i]['participantId'], //0
            json['participantIdentities'][i]['player']['summonerName'], //1
            json['participants'][i]['championId'], //2
            json['participants'][i]['stats']['kills'], //3
            json['participants'][i]['stats']['deaths'], //4
            json['participants'][i]['stats']['assists'], //5
            json['participants'][i]['stats']['killingSprees'], //6
            json['participants'][i]['stats']['largestMultiKill'], //7
            json['participants'][i]['stats']['longestTimeSpentLiving'], //8
            json['participants'][i]['stats']['visionScore'], //9 
            json['participants'][i]['stats']['totalMinionsKilled'] +
            json['participants'][i]['stats']['neutralMinionsKilled'],//10
            json['participants'][i]['stats']['turretKills'], //11
            json['participants'][i]['stats']['goldEarned'] //12

            ];
            if (champ_id_player == player[i][2])
                player_index = i;

        }
        let champID = [];
        //oblliczanie golda
        let gold = [];
        for (var i = 0; i < 10; i++) {
            champID[i] = player[i][2]
            gold[i] = player[i][12];
        }
        // let id_max_gold = gold_max(gold);
        let team1_stats = [0, 0, 0, 0, 0, 0];
        let team2_stats = [0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 5; i++) {
            team1_stats[0] += player[i][3]; //kile 0
            team1_stats[1] += player[i][4]; //deady 1
            team1_stats[2] += player[i][5]; //asysty 2
            team1_stats[3] += player[i][12]; //gold 3
            team1_stats[4] += player[i][9]; //wizja 4
            team1_stats[5] += player[i][10]; //cs 5
        }

        for (var i = 5; i < 10; i++) {
            team2_stats[0] += player[i][3]; //kile 0
            team2_stats[1] += player[i][4]; //deady 1
            team2_stats[2] += player[i][5]; //asysty 2
            team2_stats[3] += player[i][12]; //gold 3
            team2_stats[4] += player[i][9]; //wizja 4
            team2_stats[5] += player[i][10]; //cs 5
        }


        let championName = await read_champ_id(champID);
        if (championName == -1) {
            msg.followUp("Błąd połączenia");
            return -1;
        }

        let game_description = await read_game_id(queueID);
        if (game_description == -1) {
            msg.followUp("Błąd połączenia");
            return -1;
        }

        let embed1 = new MessageEmbed()
            .setColor('#ffa500')
            .setTitle(game_description)
            .setAuthor("League of Legends")
            .setDescription('Długość gry: ' + Math.round(game_duration / 60) + ' min')
            .addFields(
                {
                    name: "Druzyna 1: " + team[0][1] + "\n" + your_team(player_index, 0),
                    value: championName[0] + " - " + player[0][1] +
                        "\n" + championName[1] + " - " + player[1][1] +
                        "\n" + championName[2] + " - " + player[2][1] +
                        "\n" + championName[3] + " - " + player[3][1] +
                        "\n" + championName[4] + " - " + player[4][1],
                    inline: true
                },
                {
                    name: "Druzyna 2: " + team[1][1] + "\n" + your_team(player_index, 1),
                    value: championName[5] + " - " + player[5][1] +
                        "\n" + championName[6] + " - " + player[6][1] +
                        "\n" + championName[7] + " - " + player[7][1] +
                        "\n" + championName[8] + " - " + player[8][1] +
                        "\n" + championName[9] + " - " + player[9][1],
                    inline: true
                },
            )
            .addFields(
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: false
                }
            )
            .addFields(
                {
                    name: "Statystki:",
                    value:
                        "KDA: " + team1_stats[0] + " / " + team1_stats[1] + " / " + team1_stats[2] +
                        "\nIlość złota: " + + team1_stats[3] +
                        " g\nWizja: " + team1_stats[4] +
                        " pkt\nCS: " + team1_stats[5] +
                        "\nZniszczone wieże: " + team[0][9] +
                        "\nZniszczone inhibitory: " + team[0][8] +
                        "\nZabite barony: " + team[0][10] +
                        "\nZabite smoki: " + team[0][11] +
                        "\nZabite heraldy: " + team[0][12] +
                        "\nPierwsza krew:" + team[0][2] +
                        "\nPierwsza wieża:" + team[0][3] +
                        "\nPierwszy inhibitor: " + team[0][4] +
                        "\nPierwszy smok: " + team[0][5] +
                        "\nPierwszy baron: " + team[0][6] +
                        "\nPierwszy herald: " + team[0][7],
                    inline: true
                },
                {
                    name: 'Statystyki: ',
                    value:
                        "KDA: " + team2_stats[0] + " / " + team2_stats[1] + " / " + team2_stats[2] +
                        "\nIlość złota: " + + team2_stats[3] +
                        " g\nWizja: " + team2_stats[4] +
                        " pkt\nCS: " + team2_stats[5] +
                        "\nZniszczone wieże: " + team[1][9] +
                        "\nZniszczone inhibitory: " + team[1][8] +
                        "\nZabite barony: " + team[1][10] +
                        "\nZabite smoki: " + team[1][11] +
                        "\nZabite heraldy: " + team[1][12] +
                        "\nPierwsza krew:" + team[1][2] +
                        "\nPierwsza wieża:" + team[1][3] +
                        "\nPierwszy inhibitor: " + team[1][4] +
                        "\nPierwszy smok: " + team[1][5] +
                        "\nPierwszy baron: " + team[1][6] +
                        "\nPierwszy herald: " + team[1][7],
                    inline: true
                },

            )
        // .setThumbnail('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + encodeURI(championName[player_index]) + '_0.jpg');

        msg.followUp({ embeds: [embed1] })
      

        let embed2 = new MessageEmbed()
            .setColor('#9ac1ad')
            .setTitle("STATYSTYKI")
            // .setThumbnail('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + encodeURI(championName[id_max_gold]) + '_0.jpg')
            .addFields(

                {
                    name: display_name(championName, player, 0),
                    value: display_value(player, game_duration, 0),
                    inline: true
                },

                {
                    name: display_name(championName, player, 5),
                    value: display_value(player, game_duration, 5),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: display_name(championName, player, 1),
                    value: display_value(player, game_duration, 1),
                    inline: true
                },
                {
                    name: display_name(championName, player, 6),
                    value: display_value(player, game_duration, 6),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: display_name(championName, player, 2),
                    value: display_value(player, game_duration, 2),
                    inline: true
                },
                {
                    name: display_name(championName, player, 7),
                    value: display_value(player, game_duration, 7),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: display_name(championName, player, 3),
                    value: display_value(player, game_duration, 3),
                    inline: true
                },
                {
                    name: display_name(championName, player, 8),
                    value: display_value(player, game_duration, 8),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: display_name(championName, player, 4),
                    value: display_value(player, game_duration, 4),
                    inline: true
                },
                {
                    name: display_name(championName, player, 9),
                    value: display_value(player, game_duration, 9),
                    inline: true
                },

            );
        msg.channel.send({ embeds: [embed2] })
   
    }


};




function display_name(championName = [], player = [], i) {
    return championName[i] + " -> " + player[i][1];
}

function display_value(player = [], game_duration, i) {
    //najdłuższy czas bez śmierci jeśli gracz miał 0 zgonów
    let l = Math.round(player[i][8] / 60);
    if (l == 0)
        l = Math.round(game_duration / 60);

    return "KDA: " + player[i][3] + " / " + player[i][4] + " / " + player[i][5] +
        "\nCs: " + player[i][10] +
        "\nCs na minute: " + (player[i][10] / (game_duration / 60)).toFixed(2) +
        "\n Wieże: " + player[i][11] +
        "\nWizja: " + player[i][9] +
        " pkt\nWizja na minute: " + (player[i][9] / (game_duration / 60)).toFixed(2) +
        " pkt\nNaj. czas bez śmierci: " + l + " min" +
        "\nNaj. seria zabójstw: " + player[i][6] +
        "\nNajwiększe wielobójstwo: " + player[i][7] +
        "\nZdobyte złoto: " + player[i][12].toLocaleString('en') + " g";

}



async function read_game_id(queueID) {
    let url = "http://static.developer.riotgames.com/docs/lol/queues.json";
    let response, json;
    try {
        response = await fetch(url);
        json = await response.json()
    }
    catch {
        return -1;
    }
    for (var i = 0; i < json.length; i++) {
        if (json[i]['queueId'] == queueID) {
            return json[i]['map'] + " " + json[i]['description'];
        }
    }
    return -1;
}

async function read_champ_id(champID = []) {
    let url = "http://ddragon.leagueoflegends.com/cdn/11.10.1/data/en_US/champion.json";
    let response, json;
    try {
        response = await fetch(url);
        json = await response.json()
    }
    catch {
        return -1;
    }

    let championList = json.data;
    let result = [];
    let p = 0;

    for (var j in champID) {
        for (var i in championList) {
            if (championList[i].key == champID[j]) {
                result[p] = championList[i].name;
                p = p + 1;
            }
        }
    }
    // console.log(result[0]);
    return result;

}



function your_team(player_index, p) {
    if (player_index < 5 && p == 0)
        return "Twoja drużyna";
    if ((player_index >= 5 && p == 0))
        return "Przeciwnicy";

    if (player_index >= 5 && p == 1)
        return "Twoja drużyna";
    if ((player_index < 5 && p == 1))
        return "Przeciwnicy";
}