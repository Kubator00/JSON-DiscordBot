const index = require("../../../index.js");

module.exports = {
    name: 'ping',
    description: "Wyświetla ping bota",

    async execute(msg) {
        msg.followUp(`Ping bota: ${index.client.ws.ping} ms`);
    }
}