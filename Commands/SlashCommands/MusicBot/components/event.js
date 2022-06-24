import * as events from "events";
import sendPlayerEmbed from "./sendPlayerEmbed.js";

export const emitter = new events.EventEmitter();

emitter.on('musicEnd', (guildId) => {
    sendPlayerEmbed(guildId);
})