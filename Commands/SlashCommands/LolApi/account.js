const lol_functions = require('./Functions/lol_other_functions.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolKey = require('./Functions/key_lol.js');
const apiLolKey = lolKey.apiLolKey;

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
        let summoner = msg.options.getString('nazwa');
        summonerPlayerName = encodeURI(summoner);
        const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolKey;
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

        const ranks = await lol_functions.read_player_rank_and_stats(summonerIdPlayer);
        if (ranks == -1) {
            msg.followUp("Błąd połączenia");
            lol_functions.lol_error("Pobieranie read_player_rank_and_stats");
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
            .setImage('http://ddragon.leagueoflegends.com/cdn/' + await lol_functions.dataDragonVersion + '/img/profileicon/' + player.profileIconId + '.png')
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


        msg.followUp({ embeds: [embed] });

    }
}