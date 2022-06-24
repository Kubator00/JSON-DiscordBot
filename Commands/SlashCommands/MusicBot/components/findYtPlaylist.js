import ytpl from "ytpl";

export default async (msg, url) => {
    try {
        if (!ytpl.validateID(url))
            throw new Error('Invalid url');
        const musicList = await ytpl(url, {pages: 1});
        return getMusicArray(musicList);
    } catch (err) {
        throw err;
    }
}

const getMusicArray = (musicList) => {
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