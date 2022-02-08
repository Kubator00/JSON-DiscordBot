const date = require('./date');
const checkPremissions = require('./ErrorHandlers/errorHandlers').checkPremissions;
const channels = require('./Database/readChannelName');

module.exports = (client) => {
    client.on("guildMemberAdd", member => {
        (async () => {
            let channel = await channels.fetch_channel(client, await channels.read_channel('guild_members_update', member.guild.id));
            if (checkPremissions(channel))
                channel.send(`Witaj ${member.user.username} na naszym serwerze.\nŻyczymy miło spędzonego czasu 😀`);
        })();
    });


    client.on("guildMemberRemove", member => {
        (async () => {
            channel = await channels.fetch_channel(client, await channels.read_channel('guild_members_update', member.guild.id))
            if (checkPremissions(channel))
                channel.send(`Użytkownik ${member.user.username} opuścił serwer 😥`);
        })();
    });
}
