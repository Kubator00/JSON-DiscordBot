const date = require("../../../date.js");

module.exports = {
    name: 'godzina',
    description: "Wyświetla aktualną godzinę",

    async execute(msg) {
        msg.followUp("Jest godzina " + date.hour() + ":" + date.minute());
    }
}