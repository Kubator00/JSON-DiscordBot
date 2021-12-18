const database = require(`../../../database/database.js`)


module.exports = {
    name: 'wiadomosc',
    description: "Wysyłam losową wiadomość",

    async execute(msg) {
       const message= await database.rand_message("DIFFERENT_MESSAGES");
       msg.followUp(message);
    }
}