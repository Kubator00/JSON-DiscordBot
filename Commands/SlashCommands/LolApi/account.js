const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolFunctions = require('./Functions/lolCommonFunctions.js');
const lolToken = require('./Functions/lolToken.js');
const apiLolToken = lolToken.apiLolToken;
const errorNotifications = require('../../../errorNotifications');
const channelNames = require('../../../channelNames');

module.exports = {
    name: 'konto',
    description: "Wyświetla statystyki konta z gry League of Legends",
    options: [
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
        summonerPlayerName = encodeURI(summoner);
        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
        const responseSummoner = await fetch(urlSummoner);
        if (responseSummoner.status == 429) {
            msg.followUp("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
            return;
        }
        if (responseSummoner.status != 200) {
            msg.followUp("```diff\n-Nie ma konta o takiej nazwie 🙁\n-Pamiętaj że konto musi znajdować się na serwerze EUNE```");
        }
        const jsonSummoner = await responseSummoner.json();
        const summonerIdPlayer = jsonSummoner.id;

        const ranks = await lolFunctions.read_player_rank_and_stats(summonerIdPlayer);
        if (!ranks) {
            msg.followUp("Błąd połączenia");
            errorNotifications("Lol Api Account, Błąd pobierania playerRankAndStats");
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
            msg.followUp({ embeds: [embed] });
        }
        catch {
            errorNotifications("Lol Api Account, Błąd wysłania wiadomości embed");
        }

    }
}