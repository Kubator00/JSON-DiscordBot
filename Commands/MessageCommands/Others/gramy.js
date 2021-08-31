const database = require(`../../../database.js`)

module.exports = {
    name: 'gramy',
    aliases: ['zagramy', 'robimy cos', 'grasz'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👍');
        const result = await database.rand_message("DZIALANIE");
        msg.channel.send(result);
    },
};