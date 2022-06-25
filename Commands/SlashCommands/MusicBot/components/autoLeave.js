import queue from "./queueMap.js";
import {emitter} from "./event.js";

export default async function autoLeaveChannel(guildId) {
    try {
        const voiceChannel = queue.get(guildId).voiceChannel;
        if (voiceChannel.members.size > 1) {
            setTimeout(() => autoLeaveChannel(guildId), 60000);
            return;
        }
        const conn = queue.get(guildId).connection;
        conn.destroy();
        queue.delete(guildId);
        emitter.emit('leaveChannel', guildId);
    } catch (err) {
        console.error(`Błąd wyjścia z kanału głosowego, ${err}`);
    }
}

