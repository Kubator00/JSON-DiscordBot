const database = require(`../../../database.js`)

module.exports = {
    name: 'siema',
    aliases: ['witam', 'dzien dobry','elo','hej','czesc'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('🖐️');
        const result = await database.rand_message("POWITANIE");
        msg.channel.send(result);
    },
};