import {checkPermissions} from "../ErrorHandlers/errorHandlers.js";

export default {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand())
            return;
        if (!checkPermissions(interaction.channel))
            return;
        await interaction.deferReply({ephemeral: false}).catch(() => {
        });

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return await interaction.followUp({content: "Polecenie nie istnieje"}) && client.slashCommands.delete(interaction.commandName);
        try {
            command.execute(interaction);
        } catch (err) {
            console.log(err);
            console.log("Odnotowano błąd wysłania wiadomości");
        }
    }
}