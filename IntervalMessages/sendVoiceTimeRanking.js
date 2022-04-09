import {findChannel} from "../Database/readChannelName.js";
import checkPermissions from "../ErrorHandlers/checkPermissions.js";
import sendVoiceTimeRanking from "../VoiceStats/sendVoiceTimeRanking.js";


export default (client, guildId) => {
    (async() => {
        const channel = await findChannel(client, 'voice_time_users', guildId);
        if (!checkPermissions(channel))
            return;
        let messages = await channel.messages.fetch();
        if (channel.permissionsFor(channel.client.user).has('MANAGE_MESSAGES')) {
            try {
                messages.forEach(msg => {
                    msg.delete();
                })
            } catch (err) {
                console.log(err);
            }
        }
        await sendVoiceTimeRanking(channel);
    })();
}