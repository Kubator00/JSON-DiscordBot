export default {
    name: 'bot',
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('🤖');
        msg.channel.send("Pik Pik");
    },
};