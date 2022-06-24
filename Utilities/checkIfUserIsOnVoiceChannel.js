export default (msg) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
        msg.followUp("Musisz być na kanale głosowym aby wykonać polecenie!");
        return false;
    }
    return true;
}