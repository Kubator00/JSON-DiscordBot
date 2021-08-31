const music_functions = require("./Functions/all_functions.js")
const queue = music_functions.queue;


module.exports = {
    name: 'wyjdz',
    description: "Bot muzyczny opuszca kanał, kończy granie muzyki",

    async execute(msg) {
        try {
            const conn = queue.get(msg.guild.id).connection;
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby wyłączyć muzykę!");
            conn.destroy();
            queue.delete(msg.guild.id);
            return msg.followUp("To ja spadam!");
        }
        catch {
            return msg.followUp("Muzyka nie jest aktywna");
        }
    },

}

