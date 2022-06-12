import randomInt from "../../../Utilities/getRandomInt.js"
import {MessageEmbed} from "discord.js";
import loadJSON from "../../../Utilities/loadJSON.js";
import  {dirname} from "path";
import {fileURLToPath} from "url";

export default {
    name: 'losuj_drużyne',
    description: "Losowanie drużyny w League of Legends",
    async execute(msg) {
        const json = loadJSON(dirname(fileURLToPath(import.meta.url)), 'championsLanes.json');
        let embed = new MessageEmbed()
            .setColor('#2ECC71')
            .setTitle("Wylosowane postacie")
            .setTimestamp()
            .addFields(
                {name: 'Top', value: `${json.top[randomInt(0, json.top.length - 1)]}`},
                {name: 'Jungle', value: `${json.jungle[randomInt(0, json.jungle.length - 1)]}`},
                {name: 'Mid', value: `${json.mid[randomInt(0, json.mid.length - 1)]}`},
                {name: 'Bot', value: `${json.bot[randomInt(0, json.bot.length - 1)]}`},
                {name: 'Support', value: `${json.support[randomInt(0, json.support.length - 1)]}`},
            )

        await msg.followUp({embeds: [embed]});

    }
}
