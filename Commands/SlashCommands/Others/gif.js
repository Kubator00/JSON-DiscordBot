const gif = require(`../../../Gifs/gif`)

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
        const keywords = interaction.options.getString('nazwa');
        await interaction.followUp(await gif.tenor_gif(keywords, interaction.channel));
    },

}

