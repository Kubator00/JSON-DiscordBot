const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = async (msg) => {
    msg.component.setDisabled(true);
    await msg.update({
        components: [
            new MessageActionRow().addComponents(msg.component)
        ]
    });
}