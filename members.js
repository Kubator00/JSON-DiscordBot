exports.members = (client, channel_list, date) => {


    client.on("guildMemberAdd", member => {
        var channel = client.channels.cache.find(channel => channel.name === channel_list[0]);
        channel.send('Witaj ' + member.user.username + ' na naszym serwerze.\nŻyczymy miłego pobytu 😀')
            .catch(error => console.log(error));

        channel = client.channels.cache.find(channel => channel.name === channel_list[9])
        channel.send('Dołączył: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message())
            .catch(error =>console.log(error));
    });


    client.on("guildMemberRemove", member => {
        var channel = client.channels.cache.find(channel => channel.name === channel_list[9])
        channel.send('Opuścił: ' + member.user.username + '\n' + date.hour() + ":" + date.minute() + "\n" + date.day_message())
            .catch(error => console.log(error));
    });

}