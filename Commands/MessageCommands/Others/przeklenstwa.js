

module.exports = {
    name: 'kurwa',
    aliases: ['chuj', 'jebac', 'pierdole', 'kurwie', 'fuck', 'dupa'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('😡');
    },
};