module.exports = {
    name: 'jeść',
    aliases: ['zjeść','jem','zjem', 'wszamam', 'wszamać',],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        msg.channel.send("Smacznego 😋")
    },
};