import {client} from "../../../index.js";
import {SlashCommandBuilder} from "@discordjs/builders";


export default {
    data: new SlashCommandBuilder()
        .setName('lista2')
        .setDescription("Wyświetla listę znajdujących się na kanale głosowych"),
    async execute(msg) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return msg.followUp("Musisz znajdować sie na kanale głosowym!");
        const guild = client.guilds.cache.get(msg.guild.id);
        const channelVoiceId = msg.member.voice.channelId;
        const channel = guild.channels.cache.find(element => (element.id === channelVoiceId));


        let userList = [];
        channel.members.forEach(
             (user) => {
                if (user.nickname)
                    userList.push(user.nickname);
                else
                    userList.push(user.user.username);
            }
        );
        userList.sort();
        let result = `Lista członków na kanale "${channel.name}":\n`;
        let i = 1;
        for (let user of userList) {
            result += `${i}. ${user}\n`;
            i += 1;
        }
        try {
            await msg.followUp(result);
        }
        catch (err) {
          console.log(err);
        }
    }
}