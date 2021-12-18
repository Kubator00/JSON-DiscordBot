const database = require(`../../../database/database.js`)

module.exports = {
    name: 'gramy',
    aliases: ['zagramy', 'robimy coś', 'grasz'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👍');
        const result = await database.rand_message("DZIALANIE");
        msg.channel.send(result);
    },
};