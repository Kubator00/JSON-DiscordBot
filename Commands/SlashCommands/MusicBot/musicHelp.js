import {client} from "../../../index.js";
import {MessageEmbed} from "discord.js";
import {checkIfChannelIsCorrect} from "../../../Database/getChannel.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('muzyka_pomoc')
        .setDescription('Wyświetla dostępne komendy do interakcji z botem muzycznym'),
    async execute(msg) {
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg))
            return;
        let embed = new MessageEmbed()
            .setColor('#ffa500')
            .setAuthor("DJ\n"
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
                    value: "```fix\n/graj_liste [link] ```"

                },
            )
        await msg.followUp({embeds: [embed]}).catch((err) => console.log(err));
    }
};