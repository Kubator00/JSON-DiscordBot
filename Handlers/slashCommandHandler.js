import {readdirSync} from 'fs';
import {Collection} from "discord.js";
import discordToken from "../discordToken.js";
import {REST} from "@discordjs/rest";
import {Routes} from 'discord-api-types/v10';

export default async (client) => {
    client.commands = new Collection();
    let commands = [];
    const commandFolder = readdirSync('./Commands/SlashCommands')
    for (const folder of commandFolder) {
        const commandFiles = readdirSync(`./Commands/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = (await import(`../Commands/SlashCommands/${folder}/${file}`)).default;
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
    const rest = new REST({version: '10'}).setToken(discordToken);
    client.on('ready', async () => {
        await rest.put(Routes.applicationCommands(client.user.id),
            {body: commands})
            .then(() => console.log('Successfully registered application commands'))
            .catch(console.error);

    })

};