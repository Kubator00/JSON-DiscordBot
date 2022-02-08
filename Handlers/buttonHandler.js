
const { readdirSync } = require('fs');

module.exports = (client) => {


    const messageFolder = readdirSync('./Commands/Buttons');
    for (const folder of messageFolder) {
        const messageFiles = readdirSync(`./Commands/Buttons/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of messageFiles) {
            const command = require(`../Commands/Buttons/${folder}/${file}`);
            client.buttons.set(command.name, command);
        };
    };

};