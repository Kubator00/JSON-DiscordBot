const database = require(`../../../database/database.js`)

module.exports = {
    name: 'star wars',
    aliases: ['gwiezdne wojny'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('⭐');
        const result = await database.rand_message("STAR_WARS");
        msg.channel.send(result);
    },
};