import {findChannel} from "../Database/getChannel.js";
import checkChannelPermissions from "../checkChannelPermissions.js";
import {sendVoiceTimeRanking,sendVoiceTimeRankingLast7Days} from "../VoiceStats/sendVoiceTimeRanking.js";


export default (client, guildId) => {
    (async() => {
        const channel = await findChannel(client, 'voice_time_users', guildId);
        if (!checkChannelPermissions(channel))
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
        await sendVoiceTimeRankingLast7Days(channel);
    })();
}