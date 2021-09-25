const checkPremissions = require("../checkPremissions");

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {

        if (!interaction.isCommand())
            return;

        if (!checkPremissions)
            return;
        

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