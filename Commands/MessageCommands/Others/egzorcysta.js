const databaseRandomMsg = require(`../../../Database/databaseRandomMsg.js`)

module.exports = {
    name: 'egzorcysta',
    aliases: ['boner', 'bogdan'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👊');
        const result = await databaseRandomMsg("EGZORCYSTA");
        msg.channel.send(result);
    },
};