import queue from "./queueMap.js";

export default  (msg) => {
    const songs = queue.get(msg.guild.id)?.songs;
    return songs?.length > 0;
}
