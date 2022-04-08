import ytpl from "ytpl";

export default async function findPlaylistYT(msg, url) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
        await msg.followUp("Musisz być na kanale głosowym aby dodac piosenkę!");
        return;
    }
    try {
        if (ytpl.validateID(url)) {
            const musicList = await ytpl(url, { pages: 1 });
            let result = [];
            for (let music of musicList.items) {
                let musicInfo = {
                    title: music.title,
                    url: music.url,
                    img: music.thumbnails[0].url
                };
                result.push(musicInfo);
            }
            return result;
        }
        else
            await msg.followUp("Nie znaleziono playlisty");
    }
    catch (err) {
        await msg.followUp("Nie znaleziono playlisty");
        console.log(`${err}`);
    }

}