const index = require('../../../index.js');
const channelNames = require('../../../Database/readChannelName.js');
const find_music=require('./components/findYtMusic.js').find_music;
const add_to_queue=require('./components/addToQueue.js').add_to_queue;

module.exports = {
    name: 'graj',
    description: "Odtwarzaj muzyke",
    options: [
        {
            name: "nazwa",
            description: "Nazwa lub URL piosenki",
            type: "STRING",
            required: true
        },
    ],
    async execute(msg) {
        const musicBotChannel = await channelNames.fetch_channel(index.client, await channelNames.read_channel('music_bot', msg.guild.id));
        if (musicBotChannel.id != msg.channel.id) 
            return msg.followUp(`Komenda może być tylko użyta na kanale ${musicBotChannel.name}`);
        

        const url = msg.options.getString('nazwa');

        let song = await find_music(msg, url);
        if (song) 
            await add_to_queue(msg, song, false);
        

    },

}

