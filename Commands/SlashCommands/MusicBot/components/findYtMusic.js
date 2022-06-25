import ytdl from "ytdl-core";
import ytsr from "ytsr";

export default async function findMusicYT(url) {
    try {
        if (ytdl.validateURL(url))
            return await getMusicByUrl(url);
        return await getMusicByKeyword(url);
    } catch (err) {
        throw err;
    }
}

const getMusicByUrl = async (url) => {
    try {
        const musicInfo = await ytdl.getInfo(url);
        return {
            title: musicInfo.videoDetails.title,
            url: musicInfo.videoDetails.video_url,
            img: musicInfo.videoDetails?.thumbnails[musicInfo.videoDetails?.thumbnails.length - 1].url
            //thumbnails.length-1 have the best quality
        };
    } catch (err) {
        throw new Error('Nie znaleziono piosenki')
    }
}

const getMusicByKeyword = async (keyword) => {
    try {
        const musicList = await ytsr(keyword, {limit: 1});
        if (musicList.items.length < 1 || musicList.items[0].type !== 'video')
            throw Error;
        return {
            title: musicList.items[0].title,
            url: musicList.items[0].url,
            img: musicList.items[0]?.thumbnails[0].url
        };
    } catch (err) {
        throw new Error('Nie znaleziono piosenki');
    }
}