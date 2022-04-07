
const { readdirSync } = require('fs');

module.exports = (client) => {


    const messageFolder = readdirSync('./Commands/MessageCommands');
    for (const folder of messageFolder) {
        const messageFiles = readdirSync(`./Commands/MessageCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of messageFiles) {
            const command = require(`../Commands/MessageCommands/${folder}/${file}`);
            client.messageCommands.set(command.name, command);
        }
    }

};