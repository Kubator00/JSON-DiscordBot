module.exports = (client, channelNames, date, checkPremissions) => {
    client.on("guildMemberAdd", member => {
        (async () => {
            let channel = await channelNames.fetch_channel(client, await channelNames.read_channel('guild_members_update', member.guild.id));
            if (checkPremissions(channel))
                channel.send('Witaj ' + member.user.username + ' na naszym serwerze.\nŻyczymy miłego pobytu 😀');

            channel = await channelNames.fetch_channel(client, await channelNames.read_channel('panel', member.guild.id))
            if (checkPremissions(channel))
                channel.send('Dołączył: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());
        })();
    });


    client.on("guildMemberRemove", member => {
        (async () => {
            channel = await  channelNames.fetch_channel(client, await channelNames.read_channel('panel', member.guild.id))
            if (checkPremissions(channel))
                channel.send('Opuścił: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());
        })();
    });
}
