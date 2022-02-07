const databaseRandomMsg = require(`../../../Database/databaseRandomMsg.js`)

module.exports = {
    name: 'wiewiorka',
    aliases: ['co tam'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('😎');
        const result = await databaseRandomMsg("BOT_REACTION");
        msg.channel.send(result)
            .catch(err => console.log(err));
    },
};