import {MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import * as lolFunctions from './lolCommonFunctions.js'
import apiLolToken from './lolToken.js'


export default async (msg, summoner, isFollowUp) => {
    const summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName + "?api_key=" + apiLolToken;

    const responseSummoner = await fetch(urlSummoner);
    try {
        lolFunctions.checkResponseStatus(responseSummoner.status);
    } catch (err) {
        msg.followUp(err).catch(() => console.log("Błąd wysłania wiadomości"));
        return;
    }
    const data = await responseSummoner.json();
    let ranks;
    try {
        ranks = await lolFunctions.readPlayerRankAndStats(data.id);
    } catch (err) {
        msg.followUp(err).catch(() => console.log("Błąd wysłania wiadomości"));
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

    try {
        if (isFollowUp)
            await msg.followUp({
                ephemeral: false,
                embeds: [await createEmbed(player)],
                components: [buttons(summoner), selMenu(summoner)]
            });
        else
            await msg.channel.send({
                ephemeral: false,
                embeds: [await createEmbed(player)],
                components: [buttons(summoner), selMenu(summoner)]
            });
    } catch (err) {
        console.log("Błąd wysłania wiadomości");
    }
}

const createEmbed = async (player) => {
    return (
        new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor("League of Legends - informacje o koncie")
            .setTitle(player.summonerName)
            .setDescription('Poziom: ' + player.summonerLevel)
            .setThumbnail('http://ddragon.leagueoflegends.com/cdn/' + await lolFunctions.getDragonVersion() + '/img/profileicon/' + player.profileIconId + '.png')
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

    