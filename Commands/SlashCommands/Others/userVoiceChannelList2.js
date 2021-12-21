const index = require('../../../index');
const errorNotifications = require('../../../errorNotifications');
module.exports = {
    name: 'lista2',
    description: "Wyświetla listę znajdujących się na kanale głosowych",

    async execute(msg) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return msg.followUp("Musisz znajdować sie na kanale głosowym!");
        const guild = index.client.guilds.cache.get(msg.guild.id);
        const channelVoiceId = msg.member.voice.channelId;
        const channel = guild.channels.cache.find(element => (element.id == channelVoiceId));


        let userList = [];
        channel.members.forEach(
            user = (user) => {
                if (user.nickname)
                    userList.push(user.nickname);
                else
                    userList.push(user.user.username);
            }
        );
        userList.sort();
        let result = `Lista członków na kanale "${channel.name}":\n`;
        let i = 1;
        for (user of userList) {
            result += `${i}. ${user}\n`;
            i += 1;
        }
        try {
            await msg.followUp(result);
        }
        catch (err) {
            errorNotifications(`Wykryto błąd, komenda /lista, ${err}`);
        }
    }
}