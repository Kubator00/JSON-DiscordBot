export default {
    name: 'losowanie',
    description: "Losowanie liczby",
    options: [
        {
            name: "zakres",
            description: "Liczba do której chcesz losować",
            type: "NUMBER",
            required: true
        },
    ],
    async execute(msg) {
        let number = msg.options.getNumber('zakres');
        if (number < 2 || number > 100000) {
            await msg.followUp("Podano błędną wartość 😑");

        }
        else {
            await msg.followUp("Wylosowano liczbę numer: " + Math.floor(Math.random() * number + 1));
        }
    }
}
