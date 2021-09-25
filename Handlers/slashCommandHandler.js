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
        let serverId = client.guilds.cache.map(guild => guild.id);
        serverId=String(serverId[0]);    
        client.guilds.cache.get(serverId).commands.set(commandsArry);
    });

};