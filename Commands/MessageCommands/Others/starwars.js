const databaseRandomMsg = require(`../../../Database/databaseRandomMsg.js`)

module.exports = {
    name: 'star wars',
    aliases: ['gwiezdne wojny'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('⭐');
        const result = await databaseRandomMsg("STAR_WARS");
        msg.channel.send(result);
    },
};