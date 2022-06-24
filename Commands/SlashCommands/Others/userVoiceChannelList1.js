import {client} from "../../../index.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('lista1')
        .setDescription("Wyświetla listę znajdujących się na kanale głosowych"),
    async execute(msg) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return msg.followUp("Musisz znajdować sie na kanale głosowym!");
        const guild = client.guilds.cache.get(msg.guild.id);
        const channelVoiceId = msg.member.voice.channelId;
        const channel = guild.channels.cache.find(element => (element.id === channelVoiceId));


        const guildAllMembers = guild.members.cache;
        let channelAllMembers = [];
        guildAllMembers.forEach((member) => {
            if (channel.permissionsFor(member).has("CONNECT") && channel.permissionsFor(member).has("VIEW_CHANNEL") && !member.permissions.has('ADMINISTRATOR')) {
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
            (member) => {
                if (!member.permissions.has('ADMINISTRATOR')) {
                    const presentMember = channelAllMembers.find(element => element.id === member.user.id);
                    presentMember.present = "✅"
                }
            }
        );

        channelAllMembers.sort(compare);


        let result = `Lista członków na kanale "${channel.name}":\n`;
        let i = 1;
        for (let user of channelAllMembers) {
            result += `${i}. ${user.name}  ${user.present}\n`;
            if (result.length > 1500) {
                try {
                    await msg.followUp(result);
                    result = "";
                } catch (err) {
                    console.log(err);
                    result = "";
                }
            }

            i += 1;
        }
        if (result.length < 1500) {
            try {
                await msg.followUp(result);
                result = "";
            } catch (err) {
                console.log(err);
                result = "";
            }
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