const musicFunctions = require("./Functions/musicCommonFunctions.js")
const queue = musicFunctions.queue;
const channelNames = require('../../../database/readChannelName.js');
const index = require('../../../index.js');


module.exports = {
    name: 'pauza',
    description: "Pauzuje aktualnie odtwarzaną piosenke",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }

        if (!queue.get(msg.guild.id))
            return await msg.followUp("Brak piosenki");
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby pominąć muzykę!");
            const player = queue.get(msg.guild.id).player;
            player.pause()
            msg.followUp("Odtwarzanie zostało zatrzymane");
        }
        catch
        {
            msg.channel.followUp("Brak piosenek w kolejce aby zapauzować");
        }

    }
}

