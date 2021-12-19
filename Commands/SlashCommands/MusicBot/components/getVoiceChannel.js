module.exports.get_voice_connect=get_voice_connect;
function get_voice_connect(msg) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) 
        return msg.reply("Musisz znajdować sie na kanale głosowym!");

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) return msg.channel.send(`Nie mam uprawnień`);
    if (!permissions.has('SPEAK')) return msg.channel.send(`Nie mam uprawnień`);

    const connection = {
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    };

    return connection
}
