

module.exports = {
    name: 'bot',
    // aliases: ['bot'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👎');
        msg.channel.send("Wolę jak mówisz na mnie wiewiórka");
    },
};