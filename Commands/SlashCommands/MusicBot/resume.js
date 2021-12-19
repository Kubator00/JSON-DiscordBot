const index = require('../../../index.js');
const queue = require('./components/queueMap.js');
const channelNames = require('../../../database/readChannelName.js');

module.exports = {
    name: 'wznow',
    description: "Wznawia wcześniej zapauzowaną piosenkę",

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
            player.unpause()
            msg.followUp("Odtwarzanie zostało wznowione");
        }
        catch {
            msg.followUp("Brak piosenek w kolejce aby wznowic");
        }
    }
}

