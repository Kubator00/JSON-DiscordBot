const queue = require('./queueMap');
module.exports.auto_leave = auto_leave;
function auto_leave(msg) {
    try {
        const server = queue.get(msg.guild.id);
        if (!server) {
            return;
        }
        const voiceChannel = queue.get(msg.guild.id).voiceChannel;
        if (voiceChannel.members.size == 1) {
            const conn = queue.get(msg.guild.id).connection;
            conn.destroy();
            queue.delete(msg.guild.id);
        }
        else
            setTimeout(() => auto_leave(msg), 60000);
    }
    catch(err)
    {
        console.log(`Błąd wyjścia z kanału głosowego, ${err}`);
    }
}