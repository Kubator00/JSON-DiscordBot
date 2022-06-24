import {readdirSync} from 'fs';

export default async (client) => {
    const messageFolder = readdirSync('./Commands/Buttons');
    for (const folder of messageFolder) {
        const messageFiles = readdirSync(`./Commands/Buttons/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of messageFiles) {
            const command = (await import(`../Commands/Buttons/${folder}/${file}`)).default;
            client.buttons.set(command.name, command);
        }
    }

};