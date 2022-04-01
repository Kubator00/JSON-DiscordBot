
module.exports.find_music = find_music;
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
async function find_music(msg, url) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
        await msg.followUp("Musisz być na kanale głosowym aby dodać piosenkę!");
        return;
    }
    try {
        if (ytdl.validateURL(url)) {
            const musicInfo = await ytdl.getInfo(url);
            return { title: musicInfo.videoDetails.title, url: musicInfo.videoDetails.video_url, img: musicInfo.videoDetails?.thumbnails[musicInfo.videoDetails?.thumbnails.length - 1].url };
            //thumbnails.length-1 ma najwyzsza rozdzielczoscś
        }

        else {
            const musicList = await ytsr(url, { limit: 1 });
            if (musicList.items.length >= 1) {
                if (musicList.items[0].type == 'video') {
                    return { title: musicList.items[0].title, url: musicList.items[0].url, img: musicList.items[0]?.thumbnails[0].url };
                }
            }
        }
    } catch (err) {
        console.log(`Blad odtawrzacza ${err}`);
    }
    await msg.followUp("Nie znaleziono piosenki");
    return;
}
