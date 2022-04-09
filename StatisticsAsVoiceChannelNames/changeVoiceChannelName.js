import {findChannel} from "../Database/readChannelName.js";
import {client} from "../index.js";

export function changeVoiceChannelName(channelRole, guild, newChannelName) {
    (async () => {
        const channel = await findChannel(client, channelRole, guild[1].id);
        try {
            if (channel) {
                if (channel.permissionsFor(channel.guild.me).has("MANAGE_CHANNELS")) {
                    if (channel.name !== newChannelName)
                        channel.setName(newChannelName);
                } else
                    console.log(`Brak uprawnień do ustawienia nazwy kanału jako daty na serwerze: ${guild[1].name}`);
            }
        } catch (err) {
            console.log(err);
        }
    })();
}