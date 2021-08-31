const { DiscordTogether } = require('discord-together');
const index = require('../../../index.js');
index.client.discordTogether = new DiscordTogether(index.client);

module.exports = {
    name: 'betrayal',
    description: "Graj wspólnie na Discordzie",

    async execute(msg) {  
        if (msg.member.voice.channel) {
            index.client.discordTogether.createTogetherCode(msg.member.voice.channel.id, 'betrayal').then(async invite => {
                msg.followUp("Link do gry: ")
                return msg.channel.send(`${invite.code}`);
            });
        }
        else {
            msg.followUp("Musisz znajdować się na kanale głosowym!")
        }

    }
}