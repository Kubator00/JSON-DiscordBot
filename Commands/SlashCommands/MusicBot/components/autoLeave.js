import queue from "./queueMap.js";
import embedPlayer from "./sendPlayerEmbed.js";

export default async function autoLeaveChannel(guildId) {
    try {
        const server = queue.get(guildId);
        if (!server) {
            return;
        }
        const voiceChannel = queue.get(guildId).voiceChannel;
        if (voiceChannel.members.size === 1) {
            const conn = queue.get(guildId).connection;
            conn.destroy();
            queue.delete(guildId);
            await embedPlayer(guildId);
        } else
            setTimeout(() => autoLeaveChannel(guildId), 60000);
    } catch (err) {
        console.log(`Błąd wyjścia z kanału głosowego, ${err}`);
    }
}