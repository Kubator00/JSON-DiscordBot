const channelNames = require('./channelNames');
const date = require('./date')
const index = require('./index')


module.exports = (description) => {
    if (!description)
        description = "Brak";

    console.log(`Wykryto błąd\nData: ${date.day_message()}\nOpis: ${description}`);

    const channel = index.client.channels.cache.find(channel => channel.name === channelNames.panelChannel)
    if (!channel)
        return;

    if (channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES"))
        channel.send(`Wykryto błąd\nData: ${date.day_message()} ${date.hour()}:${date.minute()}\nOpis: ${description}`);
}