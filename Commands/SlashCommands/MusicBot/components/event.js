import * as events from "events";
import sendPlayerEmbed from "./sendPlayerEmbed.js";

export const emitter = new events.EventEmitter();


emitter.on('leaveChannel', (guildId) => {
    sendPlayerEmbed(guildId);
})

emitter.on('musicEnd', (guildId) => {
    sendPlayerEmbed(guildId);
})