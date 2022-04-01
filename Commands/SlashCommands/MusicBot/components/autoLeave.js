const queue = require('./queueMap');
const embedPlayer = require('./embedPlayer');
module.exports.auto_leave = auto_leave;
async function auto_leave(guildId) {
    try {
        const server = queue.get(guildId);
        if (!server) {
            return;
        }
        const voiceChannel = queue.get(guildId).voiceChannel;
        if (voiceChannel.members.size == 1) {
            const conn = queue.get(guildId).connection;
            conn.destroy();
            queue.delete(guildId);
            await embedPlayer(guildId);
        }
        else
            setTimeout(() => auto_leave(guildId), 60000);
    }
    catch(err){
        console.log(`Błąd wyjścia z kanału głosowego, ${err}`);
    }
}