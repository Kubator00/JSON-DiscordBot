import {readdirSync} from 'fs';

export default async (client) => {
    const messageFolder = readdirSync('./Commands/MessageCommands');
    for (const folder of messageFolder) {
        const messageFiles = readdirSync(`./Commands/MessageCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of messageFiles) {
            const command = (await import(`../Commands/MessageCommands/${folder}/${file}`)).default;
            client.messageCommands.set(command.name, command);
        }
    }
};