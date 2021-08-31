const music_functions = require("./Functions/all_functions.js")
const queue = music_functions.queue;

module.exports = {
    name: 'kolejka',
    description: "Zobacz listę następnie odtwarzanych piosenek",

    async execute(interaction) {
        music_functions.display_queue(interaction);
    },

}

