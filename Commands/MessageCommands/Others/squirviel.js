module.exports = {
    name: 'squirviel',
    aliases: ['skurwiel', 'squrviel'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('😭');
        msg.channel.send("Nie mów tak na mnie :sob: ");
    },
};