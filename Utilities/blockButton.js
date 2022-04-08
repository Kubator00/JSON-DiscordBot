import {MessageActionRow} from "discord.js";

export default async (msg) => {
    msg.component.setDisabled(true);
    await msg.update({
        components: [
            new MessageActionRow().addComponents(msg.component)
        ]
    });
}