const date = require('../date.js')

module.exports = (channel) => {
    if (!channel) {
        // errorNotifications(`Na serwerze brakuje kanału`)
        return false;
    }
    if (!channel.permissionsFor(channel.guild.me).has("VIEW_CHANNEL")) {
        const description = `Nie mam uprawnień wyświetlania kanału: ${channel.name}, serwer:  ${channel.guild.name}`;
        console.log(`Wykryto błąd\nData: ${date.day_message()}\nOpis: ${description}`);
        return false;
    }

    if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) {
        const description = `Nie mam uprawnień wysyłania wiadomości na kanał: ${channel.name}, serwer:  ${channel.guild.name}`;
        console.log(`Wykryto błąd\nData: ${date.day_message()}\nOpis: ${description}`);
        return false;
    }

    if (!channel.permissionsFor(channel.guild.me).has("USE_APPLICATION_COMMANDS")) {
        const description = `Nie mam uprawnień uzywania poleceń aplikacji na kanale: ${channel.name}, serwer:  ${channel.guild.name} `;
        console.log(`Wykryto błąd\nData: ${date.day_message()}\nOpis: ${description}`);
        return false;
    }

    if (!channel.permissionsFor(channel.client.user).has('ADD_REACTIONS')) {
        const description = `Nie mam uprawnień dodawania reakcji na kanale: ${channel.name}, serwer:  ${channel.guild.name} `;
        console.log(`Wykryto błąd\nData: ${date.day_message()}\nOpis: ${description}`);
        return false;
    }

    return true;
}


