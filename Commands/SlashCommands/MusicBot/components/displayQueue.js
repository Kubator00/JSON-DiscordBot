const queue=require('./queueMap');
module.exports.display_queue = display_queue;
function display_queue(msg) {
    if (!queue.get(msg.guild.id))
        return msg.followUp("Brak następnych piosenek");
    const songQueue = queue.get(msg.guild.id).songs;
    let num = 0;
    let result = ""
    if (songQueue.length == 0) {
        msg.followUp("Brak następnych piosenek");
        return;
    }
    result += `Teraz gramy:  ${songQueue[0].title} \n`;
    num += 1;
    if (songQueue.length > 1) {
        result += `NASTĘPNIE: \n`;
        let i = 0;
        for (song of songQueue) {
            if (i == 0) { i += 1; continue; }
            if (num % 20 == 0) {
                msg.followUp(result);
                result = ""
            }
            result += `${num}. ${song.title}\n`
            num += 1;
        }
    }
    if (num % 20 != 0)
        msg.followUp(result);
}