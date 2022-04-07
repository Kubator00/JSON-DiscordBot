module.exports = {
    name: 'xd',
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('😂')
    },
};