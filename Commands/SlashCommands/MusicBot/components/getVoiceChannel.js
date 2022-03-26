module.exports.get_voice_connect=get_voice_connect;
async function get_voice_connect(msg) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) 
        throw new Error('Musisz znajdować sie na kanale głosowym!')
    

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        throw new Error('Nie mam uprawnień do połączenia z tym kanałem głosowym')

    const connection = {
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    };

    return connection
}
