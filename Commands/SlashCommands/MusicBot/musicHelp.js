const index = require('../../../index.js');
const { MessageEmbed } = require('discord.js');
const channelNames = require('../../../Database/readChannelName.js');
module.exports = {
    name: 'muzykapomoc',
    description: "Wyświetla dostępne komendy do interakcji z botem muzycznym",

    async execute(msg) {
        if (!await channelNames.check_channel(index.client, 'music_bot', msg))
            return;
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

            )


        msg.followUp({ embeds: [embed] });
    }
};