export default  {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isButton() && !interaction.isSelectMenu())
            return;
        if (!interaction.customId)
            return;
        const commandName = interaction.customId.split(':');
        const command = client.buttons.get(commandName[0]);
        if (!command)
            return;
        command.execute(interaction);
    }
}

