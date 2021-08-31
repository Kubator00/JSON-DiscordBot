const gif = require(`../../../gif_function.js`)

module.exports = {
    name: 'gif',
    description: "Wyślij gif-a z aplikacji Tenor",
    options: [
        {
            name: "nazwa",
            description: "Nazwa po jakiej ma być wyszukany gif",
            type: "STRING",
            required: true
        },
    ],
    async execute(interaction) {
        try {
            const keywords = interaction.options.getString('nazwa');
            await interaction.followUp(await gif.tenor_gif(keywords, interaction.channel));
        }
        catch
        {
            await interaction.followUp("Błąd wysłania gif-a");
        }

    },

}

