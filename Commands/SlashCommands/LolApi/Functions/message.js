import {MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import * as lolFunctions from './lolCommonFunctions.js'
import fetchHeaders from "./fetchHeaders.js";
import {checkResponseStatusMsg, sendErrorMsg} from "./lolCommonFunctions.js";

export default async (msg, summoner, isFollowUp) => {
    const summonerPlayerName = encodeURI(summoner);
    const urlSummoner = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerPlayerName;
    let responseSummoner;
    try {
        responseSummoner = await fetch(urlSummoner, fetchHeaders);
    } catch (err) {
        msg.channel.send("Błąd łączenia z serwerem").catch(() => console.log("Błąd wysłania wiadomości"));
        console.log(err);
        return;
    }
    if (!checkResponseStatusMsg(responseSummoner.status, msg))
        return;

    const data = await responseSummoner.json();
    let ranks;
    try {
        ranks = await lolFunctions.readPlayerRankAndStats(data.id, msg);
    } catch (err) {
        return sendErrorMsg(err, msg);
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
            msg.channel.send({
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

    