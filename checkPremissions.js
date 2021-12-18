const errorNotifications = require('./errorNotifications')

module.exports = (channel) => {
    if (!channel) {
        // errorNotifications(`Na serwerze brakuje kanału`)
        return false;
    }

    if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) {
        const description = `Nie mam uprawnień wysyłania wiadomości na kanał ${channel.name} `;
        errorNotifications(description)
        return false;
    }

    if (!channel.permissionsFor(channel.guild.me).has("USE_APPLICATION_COMMANDS")) {
        const description = `Nie mam uprawnień uzywania poleceń aplikacji na kanale ${channel.name} `;
        errorNotifications(description)
        return false;
    }

    if (!channel.permissionsFor(channel.client.user).has('ADD_REACTIONS')) {
        const description = `Nie mam uprawnień dodawania reakcji na kanale ${channel.name} `;
        errorNotifications(description)
        return false;
    }

    return true;
}


