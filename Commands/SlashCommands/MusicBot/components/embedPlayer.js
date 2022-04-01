const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const index = require('../../../../index.js');
const queue = require('./queueMap');
const channels = require('../../../../Database/readChannelName');

module.exports = async (guildId) => {
    const channel = await channels.fetch_channel(index.client, await channels.read_channel('music_bot', guildId));
    if (!channel)
        return;

    messages = await channel.messages.fetch();
    messages.forEach(oldMsg => {
        (async () => {
            try {
                if (channel.messages.fetch(oldMsg.id)) //sprawdzam czy istnieje bo inaczej przy wpiasniu 
                    await oldMsg.delete();                   //wiekszej ilosci polecen na raz usuwa ta sama wiadomosc
            } catch (err) {                            //po kilka razy i apilkacja sie crashuje
                console.log('Błąd usuwania wiadomości');
            }
        })();
    })

    let songs, embeds;
    try {
        songs = queue.get(guildId).songs;
        if (songs.length < 1)
            embeds = { ephemeral: false, embeds: [await createEmbed(null)] };
    } catch (err) {
        await channel.send({ ephemeral: false, embeds: [await createEmbed(null)] }).catch((err) => console.log(err));
        return;
    }

    if (songs && songs.length > 0)
        embeds = { ephemeral: false, embeds: [await createEmbed(songs)], components: [buttonsCreator(songs), selectMenuCreator(guildId, songs)] };

    await channel.send(embeds).catch((err) => console.log(err));
}

const createEmbed = async (songs) => {
    return (
        new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor("DJ Wiewiór")
            .setTitle("Odtwarzacz muzyki")
            .addFields(
                fieldsCreator(songs)
            )
            .setImage(getImg(songs))
    );

}

const getImg = (songs) => {
    if (!songs || !songs[0].img)
        return "";
    return songs[0].img;
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
    console.log
    if (!songs || songs.length < 1)
        return [{
            name: '\u200B',
            value: "Brak piosenek w kolejce",
        }, {
            name: '\u200B',
            value: "Użyj polecenia /graj lub /grajliste aby słuchać muzyki na kanale głosowym",
        }]

    let queueLengthToDisplay = songs.length; //embed max fields is 25
    if (songs.length > 10)
        queueLengthToDisplay = 10;
    let result = [];

    result.push({
        name: 'Teraz gramy:',
        value: `${songs[0].title}`,
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
    if (queueLengthToDisplay == 10)
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