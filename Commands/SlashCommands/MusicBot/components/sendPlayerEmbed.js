import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from 'discord.js';
import queue from "./queueMap.js";
import {findChannel} from "../../../../Database/getChannel.js";
import {client} from "../../../../index.js";


export default async (guildId) => {
    let songs;
    const channel = await getMusicChannel(guildId);
    await deletePreviousMsgFromChannel(channel);
    songs = queue.get(guildId)?.songs;
    if (!songs || songs?.length < 1) {
        await channel.send(createIdleEmbed()).catch((err) => console.log(err));
        return;
    }
    await channel.send(createEmbed(guildId, songs)).catch((err) => console.log(err));
}

const getMusicChannel = async (guildId) => {
    let channel = queue.get(guildId)?.textChannel;
    if (channel)
        return channel;
    channel = await findChannel(client, 'music_bot', guildId);
    return channel;
}


const deletePreviousMsgFromChannel = async (channel) => {
    let messages;
    try {
        messages = await channel.messages.fetch();
    } catch (err) {
        console.log(err);
        return;
    }
    if (!channel.permissionsFor(channel.client.user).has('MANAGE_MESSAGES'))
        return;
    messages.forEach(oldMsg => {
        (async () => {
            try {
                if (channel.messages.fetch(oldMsg.id))
                    await oldMsg.delete();
            } catch (err) {
                console.log('Delete msg error');
            }
        })();
    })
}


const createIdleEmbed = () => {
    return {
        ephemeral: false,
        embeds: [
            new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("🎵 │ Odtwarzacz muzyki │ 🎵")
                .addFields(
                    [{
                        name: '\u200B',
                        value: "Brak piosenek w kolejce",
                    },
                        {
                            name: '\u200B',
                            value: "Użyj polecenia /graj lub /grajliste aby słuchać muzyki na kanale głosowym",
                        }]
                )
        ]
    };
}


const createEmbed = (guildId, songs) => {
    return (
        {
            ephemeral: false,
            embeds: [
                new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle("🎵 │ Odtwarzacz muzyki │ 🎵")
                    .addFields(
                        fieldsCreator(songs)
                    )
                    .setImage(getImg(songs))
            ],
            components: [buttonsCreator(songs), selectMenuCreator(guildId, songs)]
        }
    );
}

const getImg = (songs) => {
    return songs[0].img ? songs[0].img : '';
}

const buttonsCreator = (songs) => {
    return (
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Pauza')
                    .setStyle('PRIMARY')
                    .setCustomId(`pause`),
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Wznów')
                    .setStyle('PRIMARY')
                    .setCustomId(`resume`),
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Pomiń ')
                    .setStyle('PRIMARY')
                    .setCustomId(`skip`),
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Link')
                    .setStyle('LINK')
                    .setURL(getURL(songs))
            )
            .addComponents(
                new MessageButton()
                    .setLabel('Wyjdź')
                    .setStyle('DANGER')
                    .setCustomId(`leave`),
            )
    );
}

const getURL = (songs) => {
    return songs[0].url.toString();
}

const fieldsCreator = (songs) => {
    let queueLengthToDisplay = songs.length; //embed max fields is 25
    if (songs.length > 20)
        queueLengthToDisplay = 20;
    let result = [];

    result.push({
        name: `Teraz gramy: ${songs[0].title}`,
        value: '\u200B',
    })
    if (queueLengthToDisplay > 1)
        result.push({
            name: '\u200B',
            value: `Następnie:`,
        })

    for (let i = 1; i < queueLengthToDisplay; i++) {
        result.push({
            name: '\u200B',
            value: `${i}.  ${songs[i].title}`,
        })
    }
    if (queueLengthToDisplay === 20)
        result.push({
            name: `I więcej...`,
            value: `\u200B`,
        })
    return result;
}


const selectMenuCreator = (guildId, songs) => {
    return (
        new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`gotosong:${guildId}`)
                    .setPlaceholder('Przejdź do piosenki')
                    .addOptions(selectMenuOptionsCreator(songs)),
            )
    );
}


const selectMenuOptionsCreator = (songs) => {
    let result = [];
    let queueLengthToDisplay = songs.length; //embed max fields is 25
    if (songs.length > 23)
        queueLengthToDisplay = 23;

    for (let i = 0; i < queueLengthToDisplay; i++) {
        result.push({
            label: songs[i].title,
            value: i.toString(),
        });
    }
    return result;
}