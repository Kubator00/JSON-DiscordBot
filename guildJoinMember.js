import checkChannelPermissions from './checkChannelPermissions.js'
import {findChannel} from "./Database/getChannel.js";

export default (client) => {
    client.on("guildMemberAdd", member => {
        (async () => {
            const channel = await findChannel(client, 'guild_members_update', member.guild.id);
            if (checkChannelPermissions(channel))
                channel.send(`Witaj ${member.user.username} na naszym serwerze.\nŻyczymy miło spędzonego czasu 😀`);
        })();
    });


    client.on("guildMemberRemove", member => {
        (async () => {
            const channel = await findChannel(client,'guild_members_update', member.guild.id);
            if (checkChannelPermissions(channel))
                channel.send(`Użytkownik ${member.user.username} opuścił serwer 😥`);
        })();
    });
}
