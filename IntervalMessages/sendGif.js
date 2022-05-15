import {findChannel} from "../Database/readChannelName.js";
import checkPermissions from "../ErrorHandlers/checkPermissions.js";
import {getGif} from "../Gifs/gif.js";
import randomMessageFromDatabase from "../Database/databaseRandomMsg.js";

export default (client, guildId) => {
    (async () => {
        const channel = await findChannel(client, 'gifs', guildId);
        if (checkPermissions(channel)) {
            channel.send(await getGif(await randomMessageFromDatabase("GIF_CATEGORY")));
        }
    })();
}
