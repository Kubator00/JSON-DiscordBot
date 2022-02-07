const index = require('../../../index.js');
const queue = require('./components/queueMap.js');
const channelNames = require('../../../Database/readChannelName.js');

module.exports = {
    name: 'wznow',
    description: "Wznawia wcześniej zapauzowaną piosenkę",

    async execute(msg) {
        if (!await channelNames.check_channel(index.client, 'music_bot', msg))
            return;
            
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

