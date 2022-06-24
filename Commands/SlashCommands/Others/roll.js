import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('losowanie')
        .setDescription('Losowanie liczby')
        .addNumberOption(option =>
            option
                .setName('zakres')
                .setDescription('Liczba do której chcesz losować')
                .setRequired(true)),
    async execute(msg) {
        let number = msg.options.getNumber('zakres');
        if (number < 2 || number > 100000) {
            await msg.followUp("Podano błędną wartość 😑");
            return;
        }
        await msg.followUp("Wylosowano liczbę numer: " + Math.floor(Math.random() * number + 1));
    }
}
