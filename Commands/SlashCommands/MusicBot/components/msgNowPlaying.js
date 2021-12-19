const queue = require('./queueMap');
module.exports.display_now_playing = display_now_playing;
function display_now_playing(msg) {
    if (!queue.get(msg.guild.id)) {
        msg.followUp("Brak następnych piosenek");
        return;
    }
    const songQueue = queue.get(msg.guild.id).songs;
    if (songQueue.length == 0) {
        msg.followUp("Brak następnych piosenek");
        return;
    }
    return msg.followUp(`Teraz gramy: ${songQueue[0].title} \n`);
}
