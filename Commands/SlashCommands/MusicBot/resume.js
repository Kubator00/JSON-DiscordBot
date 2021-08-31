const music_functions = require("./Functions/all_functions.js")
const queue = music_functions.queue;

module.exports = {
    name: 'wznow',
    description: "Wznawia wcześniej zapauzowaną piosenkę",

    async execute(msg) {
        if (!queue.get(msg.guild.id))
            return await msg.followUp("Brak piosenki");
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby pominąć muzykę!");
            const player = queue.get(msg.guild.id).player;
            player.unpause()
            msg.followUp("Odtwarzanie zostało wznowione");
        }
        catch {
            msg.followUp("Brak piosenek w kolejce aby wznowic");
        }
    }
}

