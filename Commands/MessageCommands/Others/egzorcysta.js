const database = require(`../../../database/database.js`)

module.exports = {
    name: 'egzorcysta',
    aliases: ['boner', 'bogdan'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👊');
        const result = await database.rand_message("EGZORCYSTA");
        msg.channel.send(result);
    },
};