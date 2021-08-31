const date = require("../../../date.js");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'data',
    description: "Wyświetla aktualną datę",

    async execute(msg) {
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        // .setTitle('Codzienna wiadomość')
        .setTitle(`Dzisiaj mamy   📅   ${date.day_of_the_week()}, ${date.full_day_message()}`)
        .setDescription('Miłego dnia 💚')
        .setAuthor('Dzień dobry 🖐')
        .setTimestamp()
      msg.followUp({ embeds: [embed] });
    }
}