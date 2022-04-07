
const { readdirSync } = require('fs');

module.exports = (client) => {

    const eventFiles = readdirSync('./Events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../Events/${file}`);

        client.on(event.name, (msg) => event.execute(client, msg));
    }

};