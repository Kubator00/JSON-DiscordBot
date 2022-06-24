import {client} from "../../../index.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Wyświetla ping bota'),
    async execute(msg) {
        await msg.followUp(`Ping bota: ${client.ws.ping} ms`);
    }
}