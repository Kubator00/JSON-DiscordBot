const music_functions = require("./Functions/all_functions.js")
const queue = music_functions.queue;

module.exports = {
    name: 'pomin',
    description: "Pomiń aktualnie odtwarzaną piosenkę",

    async execute(msg) {
        if (!queue.get(msg.guild.id))
            return msg.followUp("Brak piosenki");
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.followUp("Musisz być na kanale głosowym aby pominąć muzykę!");
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).songs.shift();
            if (queue.get(msg.guild.id).songs.length > 0) {
                return await music_functions.play_music(msg);
            }
            else {
                msg.followUp("Brak następnych piosenek w kolejce");
            }
        }
        catch {
            msg.followUp("Błąd odtwarzacza");
            return;
        }
    },

}

