const index = require('../../../index');
const errorNotifications = require('../../../errorNotifications');
module.exports = {
    name: 'lista1',
    description: "Wyświetla listę znajdujących się na kanale głosowych",

    async execute(msg) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return msg.followUp("Musisz znajdować sie na kanale głosowym!");
        const guild = index.client.guilds.cache.get(msg.guild.id);
        const channelVoiceId = msg.member.voice.channelId;
        const channel = guild.channels.cache.find(element => (element.id == channelVoiceId));

        const guildAllMembers = guild.members.cache;
        let channelAllMembers = [];
        guildAllMembers.forEach(member = (member) => {
            if (channel.permissionsFor(member).has("CONNECT")) {
                if (member.nickname)
                    channelAllMembers.push({
                        id: member.user.id,
                        name: member.nickname,
                        present: "❌"
                    });
                else
                    channelAllMembers.push({
                        id: member.user.id,
                        name: member.user.username,
                        present: "❌"
                    });
            }
        });

        channel.members.forEach(
            member = (member) => {
                const presentMember = channelAllMembers.find(element => element.id == member.user.id);
                presentMember.present = "✅"
            }
        );

        channelAllMembers.sort(compare);


        let result = `Lista członków na kanale "${channel.name}":\n`;
        let i = 1;
        for (user of channelAllMembers) {
            result += `${i}. ${user.name}  ${user.present}\n`;
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

function compare(a, b) {
    let name1 = a.name.toLowerCase(),
        name2 = b.name.toLowerCase();
    if (name1 < name2)
        return -1;
    if (name2 > name1)
        return 1;
    return 0;
}   