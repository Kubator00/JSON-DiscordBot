import queue from "./queueMap.js";

export default  (guildId) => {
    const songs = queue.get(guildId)?.songs;
    return songs?.length > 0;
}
