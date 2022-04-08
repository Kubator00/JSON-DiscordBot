export default{
    name: 'byczqu',
    aliases: ['byqu', 'byczq', 'byczu'],
    description: "Odpowiada na konkretne słowa",

    async execute(msg) {
        await msg.react('👍');
        msg.channel.send("Oj tak byczq +1")
            .catch(err => console.log(err));
    },
};