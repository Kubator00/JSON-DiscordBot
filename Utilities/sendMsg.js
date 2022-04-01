module.exports = async (msg, text, isFollowUp) => {
    if (isFollowUp)
        await msg.isFollowUp(text).catch(err => console.log(err));
    else
        await msg.channel.send(text).catch(err=>console.log(err));
}