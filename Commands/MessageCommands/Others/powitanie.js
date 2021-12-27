const databaseRandomMsg = require(`../../../database/databaseRandomMsg.js`)

module.exports = {
    name: 'siema',
    aliases: ['witam', 'dzień dobry','dzien dobry','elo','hej','cześć','czesc'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('🖐️');
        const result = await databaseRandomMsg("POWITANIE");
        msg.channel.send(result);
    },
};