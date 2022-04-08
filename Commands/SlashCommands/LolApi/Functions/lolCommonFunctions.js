import fetch from 'node-fetch'
import fetchHeaders from "./fetchHeaders.js";

export const defaultErrorMsg = "Wystąpił błąd łączenia z serwerem";

export class LolError extends Error {
    constructor(message) {
        super(message);
        this.name = message;
    }
}

export function sendErrorMsg(error, msg) {
    if (!(error instanceof (LolError)) || !error.message) {
        console.log('a');
        return msg.channel.send("Wystąpił błąd").catch(err => console.log(err));
    }
    return msg.channel.send(error.message).catch(err => console.log(err));
}

export async function getDragonVersion() {
    let url = "https://ddragon.leagueoflegends.com/api/versions.json";
    let response, json;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        return "12.5.1";
    }
    if (response.status !== 200)
        return "12.5.1";

    json = await response.json();
    return json[0];
}


export async function readChampionMastery(summonerId, championId) {
    let url = `https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`;
    let response;
    try {
        response = await fetch(url, fetchHeaders);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }
    if (response.status === 404) //prawodopodobnie pierwsza gra bohaterem i nie ma w bazie
        return 0;               //dlatego 0 pkt

    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));

    let json = await response.json()
    return json.championPoints;
}

export function checkResponseStatusMsg(responseStatus, msg) {
    try {
        if (responseStatus !== 200) {
            msg.channel.send(errorMsg(responseStatus));
            return;
        }
    } catch (err) {
        msg.channel.send("Wystąpił niezidentyfikowany błąd").catch(err => console.log(err));
        return;
    }
    return 'OK';
}

export function errorMsg(responseStatus) {
    if (responseStatus === 429)
        return "Wykorzystano dostępną ilość zapytań, spróbuj ponownie później";
    else if (responseStatus === 404)
        return "Nie znaleziono informacji o koncie";
    else if (responseStatus !== 200)
        return "Wystąpił błąd podczas wykonywania zapytania";
}

export async function readChampionsName(playersData) {
    const url = `http://ddragon.leagueoflegends.com/cdn/${await getDragonVersion()}/data/pl_PL/champion.json`;
    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }
    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));

    const json = await response.json()
    playersData.forEach(player => {
        try {
            const champ = Object.entries(json.data).find(champ => champ[1].key === player.championId.toString());
            player.championName = champ[1].name;
        } catch (err) {
            console.log("Champion not found in function readChampionsName");
        }
    });
}

export async function readSpellsName(playersData) {
    let url = "http://ddragon.leagueoflegends.com/cdn/" + await getDragonVersion() + "/data/pl_PL/summoner.json";
    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }
    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));

    const json = await response.json()

    playersData.forEach(player => {
        let found = Object.entries(json.data).find(spell => spell[1].key === player.spell1Id.toString());
        player.spell1Name = found[1].name;
        found = Object.entries(json.data).find(spell => spell[1].key === player.spell2Id.toString());
        player.spell2Name = found[1].name;
    })

}


export function embedDisplayName(playerData) {
    return playerData.championName + " -> " + playerData.summonerName;
}


export async function readAccountLevel(summonerName) {
    summonerName = encodeURI(summonerName);
    const url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName;
    let response;
    try {
        response = await fetch(url, fetchHeaders);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }

    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));

    const json = await response.json()
    return json.summonerLevel;
}


export async function readGameMode(queueID) {
    let url = "http://static.developer.riotgames.com/docs/lol/queues.json";

    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }

    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));

    const json = await response.json()
    for (const i in json) {
        if (json[i]['queueId'] === queueID) {
            let description = json[i]['description'];
            return json[i]['map'] + " " + description.toUpperCase();
        }
    }
    return "Brak danych"
}

export async function readPlayerRank(playerId) {
    let url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerId;
    let response;
    try {
        response = await fetch(url, fetchHeaders);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }

    if (response.status !== 200)
        throw new LolError(errorMsg(response.status));
    let json = await response.json();
    if (!json[0])
        return ["Brak rangi", "Brak rangi"];

    let flexRank;
    if (json[0]['queueType'] === "RANKED_FLEX_SR")
        flexRank = json[0].tier + " " + json[0].rank;
    else if (json.length < 2)
        flexRank = "Brak rangi";
    else if (json[1]['queueType'] === "RANKED_FLEX_SR")
        flexRank = json[1].tier + " " + json[1].rank;
    else
        flexRank = "Brak rangi";

    let soloRank;
    if (json[0]['queueType'] === "RANKED_SOLO_5x5")
        soloRank = json[0].tier + " " + json[0].rank;
    else if (json.length < 2)
        soloRank = "Brak rangi";
    else if (json[1]['queueType'] === "RANKED_SOLO_5x5")
        soloRank = json[1].tier + " " + json[1].rank;
    else
        soloRank = "Brak rangi";

    return [soloRank, flexRank];

}


export async function readPlayerRankAndStats(playerId, msg) {
    let url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerId;
    let response;
    try {
        response = await fetch(url, fetchHeaders);
    } catch (err) {
        console.log(err);
        throw new LolError(defaultErrorMsg);
    }

    if (response.status !== response.status)
        throw new LolError(errorMsg(response.status));

    let json = await response.json();
    if (!json[0])
        return ["Brak rangi\n", "Brak rangi\n"];

    let flexRank;
    if (json[0]['queueType'] === "RANKED_FLEX_SR")
        flexRank = json[0].tier + " " + json[0].rank
            + "\nW: " + json[0].wins + " L: " + json[0].losses
            + " Wr: " + Math.round(json[0].wins * 100 / (json[0].wins + json[0].losses)) + "%";
    else if (json.length < 2)
        flexRank = "Brak rangi\n";
    else if (json[1]['queueType'] === "RANKED_FLEX_SR")
        flexRank = json[1].tier + " " + json[1].rank
            + "\nW: " + json[1].wins + " L: " + json[1].losses
            + " Wr: " + Math.round(json[1].wins * 100 / (json[1].wins + json[1].losses)) + "%";
    else
        flexRank = "Brak rangi\n";

    let soloRank;
    if (json[0]['queueType'] === "RANKED_SOLO_5x5")
        soloRank = json[0].tier + " " + json[0].rank
            + "\nW: " + json[0].wins + " L: " + json[0].losses
            + " Wr: " + Math.round(json[0].wins * 100 / (json[0].wins + json[0].losses)) + "%";
    else if (json.length < 2)
        soloRank = "Brak rangi\n";
    else if (json[1]['queueType'] === "RANKED_SOLO_5x5")
        soloRank = json[1].tier + " " + json[1].rank
            + "\nW: " + json[1].wins + " L: " + json[1].losses
            + " Wr: " + Math.round(json[1].wins * 100 / (json[1].wins + json[1].losses)) + "%";
    else
        soloRank = "Brak rangi\n";

    return [soloRank, flexRank];

}