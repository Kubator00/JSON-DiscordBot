const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'lolpomoc',
    description: "Wyświetla dostępne komendy do interakcji z grą League of Legends",

    async execute(msg) {
        let embed = new MessageEmbed()
        .setColor('#ffa500')
        .setAuthor("League of Legends\n"
            + "●═════════════════════════════════════════════●")

        .setTitle("Instrukcja obsługi bota")
        .setDescription("Bot pozwala na uzyskanie informacji na temat swojego konta oraz meczy w League of Legends na serwerze EUNE.")
        .setFooter('🧔 Autor: Kubator')
        .setTimestamp()
        .addFields(
            {
                name: "Historia meczu",
                value: "Aby uzyskać informacje na temat statystyk z któregoś z ostatnich meczu należy użyć komendy: ```fix\n/h nr_meczu nick``` " +
                    "Przykładowo komenda: ```/h 1 Patryk``` wyświetli statystyki z ostatniego meczu gracza Patryk."

            },
            {
                name: "Mecz na żywo:",
                value: "Aby uzyskać podstawowe informacje na temat swoich sojuszników i przeciwników w obecnie trwającym meczu należy użyć komendy: ```fix\n/l nick```" +
                    "Przykładowo komenda: ```/l Patryk``` wyświetli trwający mecz gracza Patryk."

            },
            {
                name: 'Informacje o koncie',
                value: "Aby uzyskać informacje na temat konta należy użyć komendy: ```fix\n/a nick```"
                    + "Przykładowo komenda: ```/a Patryk ``` wyświetli informacje o koncie gracza Patryk"

            },
            {
                name: 'Informacje o koncie i maestrie bohaterów',
                value: "Aby uzyskać informacje na temat najczęściej wybieranych postaciach należy użyć komendy: ```fix\n/m nick```"
                    + "Przykładowo komenda: ```/m Patryk ``` wyświetli informacje o maestriach gracza Patryk"

            },

        )


    msg.followUp({ embeds: [embed] });

    }
}