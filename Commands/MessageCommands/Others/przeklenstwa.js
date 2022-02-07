

module.exports = {
    name: 'kurwa',
    aliases: ['chuj', 'jebać', 'pierdole', 'pierdolę', 'kurwie', 'fuck', 'dupa'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('😡');
    },
};