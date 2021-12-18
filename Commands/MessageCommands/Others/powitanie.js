const database = require(`../../../database/database.js`)

module.exports = {
    name: 'siema',
    aliases: ['witam', 'dzień dobry','dzien dobry','elo','hej','cześć','czesc'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('🖐️');
        const result = await database.rand_message("POWITANIE");
        msg.channel.send(result);
    },
};