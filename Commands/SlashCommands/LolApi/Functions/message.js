const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');



module.exports = async (msg, summoner, isFollowUp) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Primary')
                .setStyle('SUCCESS')
                .setCustomId(`account ${summoner}`),
        )
        .addComponents(
            new MessageButton()
                .setLabel('Primary')
                .setStyle('SUCCESS')
                .setCustomId(`live ${summoner}`),
        );

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org')
        .setDescription('Some description here');

    if (isFollowUp)
        await msg.followUp({ ephemeral: false, embeds: [embed], components: [row] });
    else
        await msg.channel.send({ ephemeral: false, embeds: [embed], components: [row] });
}
