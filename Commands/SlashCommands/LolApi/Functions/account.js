const { MessageEmbed } = require('discord.js');
const index = require('../../../../index.js');
const fetch = require('node-fetch');
const lolFunctions = require('./lolCommonFunctions.js');
const lolToken = require('./lolToken.js');
const apiLolToken = lolToken.apiLolToken;
const channelNames = require('../../../../Database/readChannelName.js');



module.exports = async (msg, summoner) => {
    summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
    const responseSummoner = await fetch(urlSummoner);
    if (responseSummoner.status == 429) {
        msg.channel.send("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
        return;
    }
    if (responseSummoner.status != 200) {
        msg.channel.send("```diff\n-Nie ma konta o takiej nazwie 🙁\n-Pamiętaj że konto musi znajdować się na serwerze EUNE```");
    }
    const jsonSummoner = await responseSummoner.json();
    const summonerIdPlayer = jsonSummoner.id;

    const ranks = await lolFunctions.read_player_rank_and_stats(summonerIdPlayer);
    if (!ranks) {
        msg.channel.send("Błąd połączenia");
        console.log("Lol Api Account, Błąd pobierania playerRankAndStats");
        return;
    }


    let player =
    {
        summonerName: jsonSummoner.name,
        summonerLevel: jsonSummoner.summonerLevel,
        profileIconId: jsonSummoner.profileIconId,
        soloqRank: ranks[0],
        flexRank: ranks[1]
    }

    let embed = new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor("Informacje o koncie")
        .setTitle(player.summonerName)
        .setDescription('Poziom: ' + player.summonerLevel)
        .setImage('http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.dataDragonVersion + '/img/profileicon/' + player.profileIconId + '.png')
        .setFooter('🧔 Autor: Kubator')
        .setTimestamp()
        .addFields(
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
        )

    try {
        msg.channel.send({ embeds: [embed] });
    }
    catch {
        console.log("Lol Api Account, Błąd wysłania wiadomości embed");
    }

}