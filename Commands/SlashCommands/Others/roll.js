const channelNames = require('../../../channelNames');

module.exports = {
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
        if (msg.channel.name != channelNames.rollChannel) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${channelNames.rollChannel}`);
            return;
        }

        let number = msg.options.getNumber('zakres');
        if (number < 2 || number > 100000) {
            msg.followUp("Podano błędną wartość 😑");

        }
        else {
            msg.followUp("Wylosowano liczbę numer: " + Math.floor(Math.random() * number + 1));
        }
    }
}
