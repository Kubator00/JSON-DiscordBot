module.exports = {
    name: 'byczqu',
    aliases: ['byqu', 'byczq','byczu'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.react('👍');
        msg.channel.send("Oj tak byczq +1");
    },
};