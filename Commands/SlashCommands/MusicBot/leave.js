const index = require('../../../index.js');
const queue = require('./components/queueMap.js');
const channelNames = require('../../../database/readChannelName.js');


module.exports = {
    name: 'wyjdz',
    description: "Bot muzyczny opuszca kanał na którym jest grana muzyka",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            await msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }
        try {
            const conn = queue.get(msg.guild.id).connection;
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby wyłączyć muzykę!");
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            conn.destroy();
            queue.delete(msg.guild.id);
            return msg.followUp("To ja spadam!");
        }
        catch {
            return msg.followUp("Muzyka nie jest aktywna");
        }
    },

}

