exports.advert = (client, msg, channelNames, checkPremissions) => {

    if (msg.author.bot) {
        return;
    }

    msgToLower = msg.content.toLowerCase();
    //wysylanie ogloszen
    const channel = client.channels.cache.find(channel => channel.name === channelNames.advertismentChannel);
        if (msg.channel.name == channel.name) {
            if (checkPremissions(channel)) {
            //     if (msgToLower.slice(0, 16) == "wspólne_granie: ") {
            //         const channel1 = client.channels.cache.find(channel => channel.name === channel_list[5]);
            //         channel1.send(msg.content.slice(16, msgToLower.len))
            //             .catch();
            //     }
            //     else if (msgToLower.slice(0, 6) == 'czat: ') {
            //         const channel1 = client.channels.cache.find(channel => channel.name === channel_list[7]);
            //         channel1.send(msg.content.slice(6, msgToLower.len))
            //             .catch();
            //     }

            //     else if (msgToLower.slice(0, 9) == 'gejroom: ') {
            //         const channel1 = client.channels.cache.find(channel => channel.name === channel_list[6]);
            //         channel1.send(msg.content.slice(9, msgToLower.len))
            //             .catch();
            //     }

            //     else if (msgToLower.slice(0, 11) == 'wiewiórka: ') {
            //         const channel1 = client.channels.cache.find(channel => channel.name === channel_list[8]);
            //         channel1.send(msg.content.slice(11, msgToLower.len))
            //             .catch();
            //     }
            //     else if (msgToLower.slice(0, 8) == 'ogólne: ') {
            //         const channel1 = client.channels.cache.find(channel => channel.name === channel_list[0]);
            //         channel1.send(msg.content.slice(8, msgToLower.len))
            //             .catch();
            //     }
            //     else {
            //         const channel1 = client.channels.cache.find(channel => channel.name === 'panel');
            //         channel1.send("Blad w wyslaniu wiadomosci ogloszenia")
            //             .catch();
            //     }
        }
    }
};

