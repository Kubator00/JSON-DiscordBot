module.exports = (client, channelNames, date, checkPremissions) => {
    client.on("guildMemberAdd", member => {

        let channel = client.channels.cache.find(channel => channel.name === channelNames.generalChannel);
        if (checkPremissions(channel))
            channel.send('Witaj ' + member.user.username + ' na naszym serwerze.\nŻyczymy miłego pobytu 😀');

        channel = client.channels.cache.find(channel => channel.name === channelNames.panelChannel)
        if (checkPremissions(channel))
            channel.send('Dołączył: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());

    });


    client.on("guildMemberRemove", member => {
        const channel = client.channels.cache.find(channel => channel.name === channelNames.panelChannel)
        if (checkPremissions(channel))
            channel.send('Opuścił: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message());
    });

}