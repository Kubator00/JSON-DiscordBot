const fetch = require('node-fetch');
const lolToken = require('./lolToken.js');
const apiLolToken = lolToken.apiLolToken;

module.exports.read_champion_mastery = read_champion_mastery;
module.exports.read_champion_id = read_champion_id;
module.exports.read_spells_id = read_spells_id;
module.exports.embed_display_name = embed_display_name;
module.exports.read_account_level = read_account_level;
module.exports.read_game_mode = read_game_mode;
module.exports.read_player_rank = read_player_rank;
module.exports.read_player_rank_and_stats = read_player_rank_and_stats;
module.exports.your_team = your_team;



let dataDragonVersion = data_dragon_version();
module.exports.dataDragonVersion = dataDragonVersion;


async function data_dragon_version() {
    let url = "https://ddragon.leagueoflegends.com/api/versions.json";
    let response, json;
    response = await fetch(url);
    if (response.status != 200)
        return "11.5.1";
    json = await response.json();
    console.log("LolApi DataDragonVersion: "+json[0]);
    return json[0];


}


async function read_champion_mastery(summonerId, championId) {
    let url = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerId + "/by-champion/" + championId + "?api_key=" + apiLolToken;
    response = await fetch(url);
    if (response.status == 404) //prawodopodobnie pierwsza gra bohaterem i nie ma w bazie
        return 0;               //dlatego 0 pkt
    if (response.status != 200) //inny błąd połączenia
        return false;

    json = await response.json()


    return json.championPoints;

}


async function read_champion_id(playersData) {
    let url = "http://ddragon.leagueoflegends.com/cdn/" + await dataDragonVersion + "/data/pl_PL/champion.json";
    let response, json;
    response = await fetch(url);
    if (response.status != 200) 
        return false;
    
    json = await response.json()

    for (let i in json.data) {
        for (let j in playersData) {
            if (playersData[j].championId == json.data[i].key)
                playersData[j].championName = json.data[i].name;
        }
    }
    return playersData;

}

async function read_spells_id(playersData) {
    let url = "http://ddragon.leagueoflegends.com/cdn/" + await dataDragonVersion + "/data/pl_PL/summoner.json";
    let response, json;

    response = await fetch(url);
    if (response.status != 200)
        return playersData;
    json = await response.json()

    let spellList = json.data;
    for (const i in spellList) {
        for (const j in playersData) {
            if (playersData[j].spell1Id == spellList[i].key)
                playersData[j].spell1Name = spellList[i].name;
            if (playersData[j].spell2Id == spellList[i].key)
                playersData[j].spell2Name = spellList[i].name;
        }
    }
    return playersData;

}


function embed_display_name(playerData) {
    return playerData.championName + " -> " + playerData.summonerName;
}


async function read_account_level(summonerName) {
    summonerName = encodeURI(summonerName);
    let url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + apiLolToken;
    let response, json;
    response = await fetch(url);
    if (response.status != 200)
        return false;
    json = await response.json()
    return json.summonerLevel;
}


async function read_game_mode(queueID) {
    let url = "http://static.developer.riotgames.com/docs/lol/queues.json";
    let response, json;

    response = await fetch(url);
    if (response.status != 200)
        return false;

    json = await response.json()

    for (const i in json) {
        if (json[i]['queueId'] == queueID) {
            let description = json[i]['description'];
            return json[i]['map'] + " " + description.toUpperCase();
        }
    }
    return "Blad";
}

function your_team(playerIndex, teamNumber) { //teamNumber przyjmuje wartości 0 lub 1
    if (playerIndex < 5 && teamNumber == 0)
        return "Twoja drużyna";
    if ((playerIndex >= 5 && teamNumber == 0))
        return "Przeciwnicy";

    if (playerIndex >= 5 && teamNumber == 1)
        return "Twoja drużyna";
    if ((playerIndex < 5 && teamNumber == 1))
        return "Przeciwnicy";
}



async function read_player_rank(playerId) {
    let url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerId + "/?api_key=" + apiLolToken;
    let response = await fetch(url);
    if (response.status != 200)
        return false;
    let json = await response.json();
    if (json[0] == undefined)
        return ["Brak rangi", "Brak rangi"];

    let flexRank;
    if (json[0]['queueType'] == "RANKED_FLEX_SR")
        flexRank = json[0].tier + " " + json[0].rank;
    else if (json[1] == undefined)
        flexRank = "Brak rangi";
    else if (json[1]['queueType'] == "RANKED_FLEX_SR")
        flexRank = json[1].tier + " " + json[1].rank;
    else
        flexRank = "Brak rangi";

    let soloRank;
    if (json[0]['queueType'] == "RANKED_SOLO_5x5")
        soloRank = json[0].tier + " " + json[0].rank;
    else if (json[1] == undefined)
        soloRank = "Brak rangi";
    else if (json[1]['queueType'] == "RANKED_SOLO_5x5")
        soloRank = json[1].tier + " " + json[1].rank;
    else
        soloRank = "Brak rangi";

    return [soloRank, flexRank];

}


async function read_player_rank_and_stats(playerId) {
    let url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerId + "/?api_key=" + apiLolToken;
    let response = await fetch(url);
    if (response.status != 200)
        return false;
    let json = await response.json();
    if (json[0] == undefined)
        return ["Brak rangi\n", "Brak rangi\n"];

    let flexRank;
    if (json[0]['queueType'] == "RANKED_FLEX_SR")
        flexRank = json[0].tier + " " + json[0].rank
            + "\nW: " + json[0].wins + " L: " + json[0].losses
            + " Wr: " + Math.round(json[0].wins * 100 / (json[0].wins + json[0].losses)) + "%";
    else if (json[1] == undefined)
        flexRank = "Brak rangi\n";
    else if (json[1]['queueType'] == "RANKED_FLEX_SR")
        flexRank = json[1].tier + " " + json[1].rank
            + "\nW: " + json[1].wins + " L: " + json[1].losses
            + " Wr: " + Math.round(json[1].wins * 100 / (json[1].wins + json[1].losses)) + "%";
    else
        flexRank = "Brak rangi\n";

    let soloRank;
    if (json[0]['queueType'] == "RANKED_SOLO_5x5")
        soloRank = json[0].tier + " " + json[0].rank
            + "\nW: " + json[0].wins + " L: " + json[0].losses
            + " Wr: " + Math.round(json[0].wins * 100 / (json[0].wins + json[0].losses)) + "%";
    else if (json[1] == undefined)
        soloRank = "Brak rangi\n";
    else if (json[1]['queueType'] == "RANKED_SOLO_5x5")
        soloRank = json[1].tier + " " + json[1].rank
            + "\nW: " + json[1].wins + " L: " + json[1].losses
            + " Wr: " + Math.round(json[1].wins * 100 / (json[1].wins + json[1].losses)) + "%";
    else
        soloRank = "Brak rangi\n";

    return [soloRank, flexRank];

}