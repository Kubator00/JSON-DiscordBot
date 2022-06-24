import {findChannel} from "../Database/getChannel.js";
import checkPermissions from "../ErrorHandlers/checkPermissions.js";
import {getGif} from "../Gifs/gif.js";
import getTableFromDb from "../Database/getTable.js";

export default (client, guildId) => {
    let keyword, url;
    (async () => {
        const channel = await findChannel(client, 'gifs', guildId);
        if (checkPermissions(channel)) {
            try {
                keyword = await getRandomGifKeyword('GIF_CATEGORY');
            } catch (err) {
                channel.send(err.message);
                return;
            }
            try {
                url = await getGif(keyword);
            } catch (err) {
                channel.send(err.message);
                return;
            }
            channel.send(url);
        }
    })();
}

async function getRandomGifKeyword(table_name) {
    let result;
    try {
        result = await getTableFromDb(table_name);
    } catch (err) {
        throw new Error('Błąd połączenia z bazą danych');
    }
    let rand = Math.floor(Math.random() * result.length);
    return result[rand]['value'];
}
