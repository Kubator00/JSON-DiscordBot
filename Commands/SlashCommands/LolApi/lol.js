const lolMessage = require('./Functions/message')

module.exports = {
    name: 'lol',
    description: "Wyświetla mecz na żywo z gry Legaue of Legends",
    options: [
        {
            name: "nazwa",
            description: "Nazwa przywoływacza, serwer EUNE",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        let summoner = msg.options.getString('nazwa');
        await lolMessage(msg, summoner,true);
    }
}