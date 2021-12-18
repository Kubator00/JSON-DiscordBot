const { readdirSync } = require('fs');

module.exports = (client) => {
    let commandsArry = [];
    const commandFolder = readdirSync('./Commands/SlashCommands')
    for (const folder of commandFolder) {
        const commandFiles = readdirSync(`./Commands/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../Commands/SlashCommands/${folder}/${file}`);
            client.slashCommands.set(command.name, command);
            commandsArry.push(command)
        };
    };



    client.on("ready", () => {
        for (guild of client.guilds.cache.map(guild => guild.id))
            client.guilds.cache.get(guild).commands.set(commandsArry);
    });
    client.on("guildCreate", (guild) => {
        client.guilds.cache.get(guild.id).commands.set(commandsArry);
    });

};