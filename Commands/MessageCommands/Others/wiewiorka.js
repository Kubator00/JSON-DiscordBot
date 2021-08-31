const database = require(`../../../database.js`)

module.exports = {
    name: 'wiewiorka',
    aliases: ['co tam'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('😎');
        const result =await database.rand_message("BOT_REACTION");
        msg.channel.send(result);
    },
};