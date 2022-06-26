import {findChannel} from "../Database/getChannel.js";
import checkChannelPermissions from "../checkChannelPermissions.js";
import * as date from "../Utilities/date.js";

export default (client, guildId) => {
    (async() => {
        const channel = await findChannel(client, 'hour', guildId);
        if (checkChannelPermissions(channel))
            channel.send("Jest godzina " + date.hourAsString() + ":00");
    })();
}
