import {findChannel} from "../Database/getChannel.js";
import checkPermissions from "../ErrorHandlers/checkPermissions.js";
import * as date from "../Utilities/date.js";

export default (client, guildId) => {
    (async() => {
        const channel = await findChannel(client, 'hour', guildId);
        if (checkPermissions(channel))
            channel.send("Jest godzina " + date.hourAsString() + ":00");
    })();
}
