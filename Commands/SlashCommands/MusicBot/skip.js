const queue = require('./components/queueMap');
const channelNames = require('../../../database/readChannelName.js');
const index = require('../../../index.js');
const display_now_playing = require('./components/msgNowPlaying').display_now_playing;
const play_music = require('./components/playMusic').play_music;

module.exports = {
    name: 'pomin',
    description: "Pomiń aktualnie odtwarzaną piosenkę",

    async execute(msg) {

        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }
        if (!queue.get(msg.guild.id))
            return msg.followUp("Brak piosenki");
        try {
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.followUp("Musisz być na kanale głosowym aby pominąć muzykę!");
            queue.get(msg.guild.id).player.stop();
            queue.get(msg.guild.id).stream.destroy();
            queue.get(msg.guild.id).player.removeAllListeners();
            queue.get(msg.guild.id).songs.shift();
            if (queue.get(msg.guild.id).songs.length > 0) {
                display_now_playing(msg);
                return await play_music(msg);
            }
            else {
                msg.followUp("Brak następnych piosenek w kolejce");
            }
        }
        catch (err) {
            msg.followUp(`Błąd odtwarzacza`);
            console.log(err);
        }
    }
}