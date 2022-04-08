import {DiscordTogether} from "discord-together";
import {client} from "../../../index.js";
client.discordTogether = new DiscordTogether(client)

export default {
    name: 'rybki',
    description: "Graj wspólnie na Discordzie",

    async execute(msg) {
        if (msg.member.voice.channel) {
            client.discordTogether.createTogetherCode(msg.member.voice.channel.id, 'fishing').then(async invite => {
                await msg.followUp("Link do gry: ")
                return msg.channel.send(`${invite.code}`);
            });
        } else {
            await msg.followUp("Musisz znajdować się na kanale głosowym!")
        }

    }
}