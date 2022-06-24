import {usersVoiceMap} from "../saveOnlineVoiceTime.js";

// adds users to map if bot reset
export default (client) => {
    client.on("ready", () => {
        for (let guildId of client.guilds.cache.map(guild => guild.id)) {
            addUsersToMap(client, guildId);
        }
    });
}

const addUsersToMap = (client, guildId) => {
    const guild = client.guilds.cache.get(guildId);
    let voiceChannels = (guild.channels.cache.filter(element => element.type === 'GUILD_VOICE')).filter(element => element.members.size > 0);
    voiceChannels.forEach(
        element1 => element1.members.forEach(
            element => {
                const member = usersVoiceMap.get(element.user.id);
                if (member)
                    return;
                const memberConstructor = {
                    id_guild: element.guild.id,
                    id: element.user.id,
                    timeStamp: Date.now(),
                }
                usersVoiceMap.set(element.user.id, memberConstructor);
            }
        )
    );
}