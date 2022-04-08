import {getGif, randomGifCategory} from "./Gifs/gif.js";
import sendVoiceTimeRanking from './VoiceStats/displayVoiceStats.js'
import {findChannel} from "./Database/readChannelName.js";
import * as date from './Utilities/date.js';
import checkPermissions from "./ErrorHandlers/checkPermissions.js"
import * as channelNameGuildStats from './channelNamesGuildStats.js'

export default  (client) => {
    setInterval(() => {
        let minute = date.minute();
        let hour = date.hour();

        if (minute === 0) {
            //wysyłanie godziny na kanał
            (async () => {
                for (let guildId of client.guilds.cache.map(guild => guild.id)) {
                    const channel = await findChannel(client, 'hour', guildId);
                    if (checkPermissions(channel))
                        channel.send("Jest godzina " + date.hour() + ":00");
                }
            })();
        }

        // //statystyki, ustawianie nowej daty
        if (hour === 0 && minute === 0) {
            channelNameGuildStats.currentDate(client);
        }

        if (minute === 0 || minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
            (async () => {
                for (let guildId of client.guilds.cache.map(guild => guild.id)) {
                    const channel = await findChannel(client, 'voice_time_users', guildId);
                    if (checkPermissions(channel)) {
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
                    }
                }
            })();
        }


        //wysyłanie gifow
        if ((minute === 0 || minute === 20 || minute === 40)) {
            (async () => {
                    for (let guildId of client.guilds.cache.map(guild => guild.id)) {
                        const channel = await findChannel(client, 'gifs', guildId);
                        if (checkPermissions(channel))
                            channel.send(await getGif(await randomGifCategory()));
                    }
                }
            )();
        }

    }, 59990);

}




