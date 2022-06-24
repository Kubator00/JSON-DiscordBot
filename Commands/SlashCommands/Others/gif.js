import {getGif} from "../../../Gifs/gif.js";
import {SlashCommandBuilder} from "@discordjs/builders";


export default {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Wysyła gif z aplikacji Tenor')
        .addStringOption(option =>
            option.setName('nazwa')
                .setDescription('Słowo kluczowe')
                .setRequired(true)),

    async execute(interaction) {
        const keywords = interaction.options.getString('nazwa');
        let gifUrl;
        try {
            gifUrl = await getGif(keywords, interaction.channel);
        } catch (e) {
            console.log(e);
            await interaction.followUp(e.message)
        }
        if (gifUrl)
            await interaction.followUp(gifUrl).catch(err => console.error(err));
    }
}

