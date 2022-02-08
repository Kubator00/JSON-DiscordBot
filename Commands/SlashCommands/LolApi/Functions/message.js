const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const lolToken = require('./lolToken.js');
const apiLolToken = lolToken.apiLolToken;
const lolFunctions = require('./lolCommonFunctions.js');



module.exports = async (msg, summoner, isFollowUp) => {

    summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;
    const responseSummoner = await fetch(urlSummoner);
    if (responseSummoner.status == 429) {
        return msg.channel.send("Wykorzystano dostępną ilość zapytań, spróbuj ponownie za chwilę");
    }

    if (responseSummoner.status != 200) {
        if (isFollowUp)
            return await msg.followUp("Nie ma takiego konta");
        else
            return await msg.channel.send("Nie ma takiego konta");
    }
    const data = await responseSummoner.json();
    const ranks = await lolFunctions.read_player_rank_and_stats(data.id);
    if (!ranks) {
        msg.channel.send("Błąd połączenia");
        console.log("Lol Api Account, Błąd pobierania playerRankAndStats");
        return;
    }

    let player =
    {
        summonerName: data.name,
        summonerLevel: data.summonerLevel,
        profileIconId: data.profileIconId,
        soloqRank: ranks[0],
        flexRank: ranks[1]
    }


    if (isFollowUp)
        await msg.followUp({ ephemeral: false, embeds: [await createEmbed(player)], components: [buttons(summoner), selMenu(summoner)] });
    else
        await msg.channel.send({ ephemeral: false, embeds: [await createEmbed(player)], components: [buttons(summoner), selMenu(summoner)] });
}


const createEmbed = async (player) => {
    return (
        new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor("League of Legends - informacje o koncie")
            .setTitle(player.summonerName)
            .setDescription('Poziom: ' + player.summonerLevel)
            .setThumbnail('http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.dataDragonVersion + '/img/profileicon/' + player.profileIconId + '.png')
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
    );
}

const buttons = (summoner) => {
    return (
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Gra na żywo')
                    .setStyle('SUCCESS')
                    .setCustomId(`lolspectator:${summoner}`),
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Mastery na bohaterach')
                    .setStyle('SUCCESS')
                    .setCustomId(`lolmastery:${summoner}`),
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Ostatnia gra')
                    .setStyle('SUCCESS')
                    .setCustomId(`lollastgamehistory:${summoner}`),
            )
    );
}

const selMenu = (summoner) => {
    return (
        new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`lolhistory:${summoner}`)
                    .setPlaceholder('Poprzednie gry')
                    .addOptions(addSelectMenuOptions()),
            )
    );
}


const addSelectMenuOptions = () => {
    let result = [];
    let n = 2;
    for (let i = 0; i < 9; i++) {
        result.push({
            label: n.toString(),
            value: n.toString(),
        });
        n += 1;
    }
    return result;
}

