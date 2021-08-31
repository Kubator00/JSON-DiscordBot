const { DiscordTogether } = require('discord-together');
const index = require('../../../index.js');
index.client.discordTogether = new DiscordTogether(index.client);

module.exports = {
    name: 'youtube',
    description: "Oglądaj wspólnie Youtube na Discordzie",

    async execute(msg) {  
        if (msg.member.voice.channel) {
            index.client.discordTogether.createTogetherCode(msg.member.voice.channel.id, 'youtube').then(async invite => {
                msg.followUp("YouTube: ")
                return msg.channel.send(`${invite.code}`);
            });
        }
        else {
            msg.followUp("Musisz znajdować się na kanale głosowym!")
        }

    }
}