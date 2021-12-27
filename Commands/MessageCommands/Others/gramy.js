const databaseRandomMsg = require(`../../../database/databaseRandomMsg.js`)

module.exports = {
    name: 'gramy',
    aliases: ['zagramy', 'robimy coś', 'grasz'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👍');
        const result = await databaseRandomMsg("DZIALANIE");
        msg.channel.send(result);
    },
};