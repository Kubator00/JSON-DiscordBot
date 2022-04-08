import {findChannel} from "./Database/readChannelName.js";
import {checkPermissions} from "./ErrorHandlers/errorHandlers.js";
export default  (client) => {
    client.on('messageCreate', msg => {
        if (msg.author.bot) 
            return;
        
        const msgToLower = msg.content.toLowerCase();
        //wysylanie ogloszen
        (async () => {
            const channel = await findChannel(client,'advertisment', msg.guild.id);
            if (!checkPermissions(channel))
                return;
            if (msg.channel.id === channel.id) {
                if (msgToLower === '/nazwy_kanałów' || msgToLower === '/nazwy_kanalow') {
                    let channelNames = `Kanały na serwerze\n`;
                    msg.guild.channels.cache.forEach(element => {
                        if (element.type === 'GUILD_TEXT')
                            channelNames += `${element}\n`;
                    });
                    channel.send(channelNames);
                    return;
                }
                const splitMsg = msgToLower.split(":");
                const channelToSend = msg.guild.channels.cache.find(element => (element.name === splitMsg[0] && element.type === "GUILD_TEXT"));
                if (!checkPermissions(channelToSend)) {
                    msg.channel.send("Kanał nie istnieje");
                    return;
                }
                channelToSend.send(msg.content.slice(channelToSend.name.length + 1, msg.content.length));
            }
        })();
    })
};

