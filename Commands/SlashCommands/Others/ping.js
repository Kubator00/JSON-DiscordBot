import {client} from "../../../index.js";

export default {
    name: 'ping',
    description: "Wyświetla ping bota",

    async execute(msg) {
        await msg.followUp(`Ping bota: ${client.ws.ping} ms`);
    }
}