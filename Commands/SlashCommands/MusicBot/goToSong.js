const index = require('../../../index.js');
const play_music = require('./components/playMusic').play_music;
const display_now_playing = require('./components/msgNowPlaying').display_now_playing;
const queue = require('./components/queueMap.js');
const channelNames = require('../../../Database/readChannelName.js');

module.exports = {
    name: 'przejdz',
    options: [
        {
            name: "nr_piosenki",
            description: "Numer piosenki którą chcemy odtworzyć",
            type: "NUMBER",
            required: true
        },
    ],
    description: "Gram piosenkę o numerze podanym w argumencie",

    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) {
            msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
            return;
        }

        if (!queue.get(msg.guild.id))
            return msg.followUp("Brak piosenki");
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby zmienić piosenkę!");

        const musicNubmer = msg.options.getNumber('nr_piosenki');
        const serverQueue = queue.get(msg.guild.id);


        if (!serverQueue || serverQueue.length <= 1) {
            msg.followUp("Nie ma piosenek w kolejce");
            return;
        }

        if (musicNubmer > serverQueue.songs.length || musicNubmer <= 0) {
            msg.followUp("Podano błędny numer piosenki");
            return;
        }
        
        queue.get(msg.guild.id).songs.splice(0, musicNubmer);
        display_now_playing(msg);
        return play_music(msg);
    }
}

