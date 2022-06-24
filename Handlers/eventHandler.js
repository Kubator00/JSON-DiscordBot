import {readdirSync} from 'fs';

export default async (client) => {
    const eventFiles = readdirSync('./Events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = (await import(`../Events/${file}`)).default;
        client.on(event.name, (msg) => event.execute(client, msg));
    }
};