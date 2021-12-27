const databaseRandomMsg = require(`../../../database/databaseRandomMsg.js`)


module.exports = {
    name: 'wiadomosc',
    description: "Wysyłam losową wiadomość",

    async execute(msg) {
        const message = await databaseRandomMsg("DIFFERENT_MESSAGES");
        msg.followUp(message);
    }
}