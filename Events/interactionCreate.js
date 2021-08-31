

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {

        if (!interaction.isCommand())
            return;

        if (!interaction.channel.permissionsFor(interaction.client.user).has('SEND_MESSAGES')
            || !interaction.channel.permissionsFor(interaction.client.user).has('ADD_REACTIONS')) {
            return console.log("Nie mam uprawnień wysylania wiadomosci lub dodawania reakcji lub używania komend aplikacji");
        }

        await interaction.deferReply({ ephemeral: false }).catch(() => { });

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return interaction.followUp({ content: "BLAD" }) && client.slashCommands.delete(interaction.commandName);
        try {
            command.execute(interaction);
        }
        catch {
            console.log("Odnotowano błąd wysłania wiadomości");
        }
    }
}