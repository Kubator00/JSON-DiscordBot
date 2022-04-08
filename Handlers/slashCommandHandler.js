import {readdirSync} from 'fs';

export default async (client) => {

    let commands = [];
    const commandFolder = readdirSync('./Commands/SlashCommands')
    for (const folder of commandFolder) {
        const commandFiles = readdirSync(`./Commands/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command= (await import(`../Commands/SlashCommands/${folder}/${file}`)).default;
            client.slashCommands.set(command.name, command);
            commands.push(command)
        }
    }

    client.on("ready", () => {
        for (let guild of client.guilds.cache.map(guild => guild.id))
            client.guilds.cache.get(guild).commands.set(commands);
    });
    client.on("guildCreate", (guild) => {
        client.guilds.cache.get(guild.id).commands.set(commands);
    });

};