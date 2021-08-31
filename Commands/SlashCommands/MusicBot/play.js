const music_functions = require("./Functions/all_functions.js")


module.exports = {
    name: 'graj',
    description: "Odtwarzaj muzyke",
    options: [
        {
            name: "nazwa",
            description: "Nazwa lub URL piosenki",
            type: "STRING",
            required: true
        },
    ],
    async execute(interaction) {
        const url = interaction.options.getString('nazwa');

        let song = await music_functions.find_music(interaction, url);
        if (song) {
            await music_functions.add_to_queue(interaction, song, false);
        }

    },

}

