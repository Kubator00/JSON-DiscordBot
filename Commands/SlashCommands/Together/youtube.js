import {DiscordTogether} from "discord-together";
import {client} from "../../../index.js";
import {SlashCommandBuilder} from "@discordjs/builders";

client.discordTogether = new DiscordTogether(client)

export default {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Oglądaj wspólnie Youtube na Discordzie'),
    async execute(msg) {
        if (msg.member.voice.channel) {
            client.discordTogether.createTogetherCode(msg.member.voice.channel.id, 'youtube').then(async invite => {
                await msg.followUp("YouTube: ")
                return msg.channel.send(`${invite.code}`);
            });
        } else {
            await msg.followUp("Musisz znajdować się na kanale głosowym!")
        }

    }
}