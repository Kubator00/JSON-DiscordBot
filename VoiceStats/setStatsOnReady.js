const usersVoiceMap = require('./saveOnlineVoiceTime').usersVoiceMap;
module.exports = (client) => {
    // dodaje użytkowników do struktury mapy jeśli bot się zresetuje
    client.on("ready", () => {
        for (guildId of client.guilds.cache.map(guild => guild.id)) {
            const guild = client.guilds.cache.get(guildId);
            let voiceChannels = (guild.channels.cache.filter(element => element.type === 'GUILD_VOICE')).filter(element => element.members.size > 0);
            voiceChannels.forEach(
                element1 => element1.members.forEach(
                    element => {
                        const member = usersVoiceMap.get(element.user.id);
                        if (!member) {
                            const memberConstructor = {
                                id_guild: element.guild.id,
                                id: element.user.id,
                                timeStamp: Date.now(),
                            }
                            usersVoiceMap.set(element.user.id, memberConstructor);
                        }
                    }
                )
            );
        }
    });
}