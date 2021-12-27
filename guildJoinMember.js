const date = require('./date');
const checkPremissions = require('./ErrorHandlers/errorHandlers').checkPremissions;
const channels = require('./Database/readChannelName');

module.exports = (client) => {
    client.on("guildMemberAdd", member => {
        (async () => {
            let channel = await channels.fetch_channel(client, await channels.read_channel('guild_members_update', member.guild.id));
            if (checkPremissions(channel))
                channel.send('Witaj ' + member.user.username + ' na naszym serwerze.\nŻyczymy miłego pobytu 😀');

            channel = await channels.fetch_channel(client, await channels.read_channel('panel', member.guild.id))
            if (checkPremissions(channel))
                channel.send('Dołączył: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());
        })();
    });


    client.on("guildMemberRemove", member => {
        (async () => {
            channel = await  channels.fetch_channel(client, await channels.read_channel('panel', member.guild.id))
            if (checkPremissions(channel))
                channel.send('Opuścił: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());
        })();
    });
}
