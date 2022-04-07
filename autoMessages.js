const displayVoiceStats = require("./VoiceStats/displayVoiceStats.js");
const gif = require('./Gifs/gif');
const channels = require('./Database/readChannelName');
const date = require('./date');
const checkPremissions = require('./ErrorHandlers/errorHandlers').checkPremissions;
const channelNameStats = require('./channelNamesGuildStats.js');

module.exports = (client) => {

    setInterval(() => {

        let minute = date.minute();
        let hour = date.hour();

        if (minute === 0) {
            //wysyłanie godziny na kanał
            (async () => {
                for (let guild of client.guilds.cache.map(guild => guild.id)) {
                    const channel = await channels.fetch_channel(client, await channels.read_channel('hour', guild));
                    if (checkPremissions(channel))
                        channel.send("Jest godzina " + date.hour() + ":00");
                }
            })();
        }

        // //statystyki, ustawianie nowej daty
        if (hour === 0 && minute === 0) {
            channelNameStats.new_date(client);
        }

        if (minute === 0 || minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
            (async () => {
                for (let guild of client.guilds.cache.map(guild => guild.id)) {
                    const channel = await channels.fetch_channel(client, await channels.read_channel('voice_time_users', guild));
                    if (checkPremissions(channel)) {
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
                        await displayVoiceStats.send_time_voice(channel);
                    }
                }
            })();
        }


        //wysyłanie gifow
        if ((minute === 0 || minute === 20 || minute === 40)) {
            (async () => {
                    for (let guild of client.guilds.cache.map(guild => guild.id)) {
                        const channel = await channels.fetch_channel(client, await channels.read_channel('gifs', guild));
                        if (checkPremissions(channel))
                            channel.send(await gif.tenor_gif(await gif.rand_gif_category()));
                    }
                }
            )();
        }

    }, 59990);

}




