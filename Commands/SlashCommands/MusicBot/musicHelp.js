const index = require('../../../index.js');
const { MessageEmbed } = require('discord.js');
const channelNames = require('../../../Database/readChannelName.js');
module.exports = {
    name: 'muzykapomoc',
    description: "Wyświetla dostępne komendy do interakcji z botem muzycznym",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }

        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("DJ WIEWIÓRA\n"
                + "●═════════════════════════════════════════════●")

            .setTitle("Instrukcja obsługi bota")
            .setDescription("Bot pozwala słuchać muzyke na kanałach głosowych Discorda.")
            .setFooter('🧔 Autor: Kubator')
            .setTimestamp()
            .addFields(
                {
                    name: "Odtwarzanie pioseki",
                    value: "```fix\n/graj [link] \n/graj [nazwa_piosenki_na_yt]```"

                },
                {
                    name: "Odtwarzanie całej playlisty",
                    value: "```fix\n/grajliste [link] ```"

                },
                {
                    name: "Lista piosenek",
                    value: "```fix\n/kolejka```"

                },
                {
                    name: "Przejdź do danej piosenki",
                    value: "```fix\n/przejdz [nr_piosenki]```"

                },
                {
                    name: "Usunięcie piosenki",
                    value: "```fix\n/usun [nr_piosenki]```"

                },
                {
                    name: 'Pomiń piosenke',
                    value: "```fix\n/pomin```"

                },
                {
                    name: 'Pauza piosenki',
                    value: "```fix\n/pauza```"

                },
                {
                    name: 'Wznowienie piosenki',
                    value: "```fix\n/wznow```"

                },


            )


        msg.followUp({ embeds: [embed] });
    }
};