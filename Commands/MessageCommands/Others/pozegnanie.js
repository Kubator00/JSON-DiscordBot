const databaseRandomMsg = require(`../../../Database/databaseRandomMsg.js`)

module.exports = {
    name: 'do widzenia',
    aliases: ['dobranoc', 'nara', 'paa', 'narazie','pa pa'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('🖐️');
        const result = await databaseRandomMsg("POZEGNANIE");
        msg.channel.send(result);
    },
};