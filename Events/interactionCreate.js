import checkChannelPermissions from "../checkChannelPermissions.js";

export default {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand())
            return;
        if (!checkChannelPermissions(interaction.channel))
            return;
        await interaction.deferReply({ephemeral: false}).catch((err) => {console.log(err)});
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error("Command doesn't exist");
            return;
        }
        try {
            command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Wystąpił błąd przy wykonywaniu polecenia', ephemeral: true });
        }
    }
}