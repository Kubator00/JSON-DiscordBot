import {client} from "../../../index.js";
import queue from "./components/queueMap.js";
import {checkIfChannelIsCorrect} from "../../../Database/readChannelName.js";
export default {
    name: 'usun',
    options: [
        {
            name: "nr_piosenki",
            description: "Numer piosenki którą chcemy usunąć z kolejki",
            type: "NUMBER",
            required: true
        },
    ],
    description: "Usuwamy piosenkę podaną w argumencie z kolejki",
    async execute(msg) {
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg))
            return;

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return await msg.followUp("Musisz być na kanale głosowym aby usunąć piosenkę!").catch((err)=>console.log(err));

        const musicNubmer = msg.options.getNumber('nr_piosenki');

        const serverQueue = queue.get(msg.guild.id);


        if (!serverQueue || serverQueue.length <= 1) {
            await msg.followUp("Nie ma piosenek w kolejce").catch((err)=>console.log(err));
        }

        if (musicNubmer > serverQueue.songs.length || musicNubmer <= 0) {
            await msg.followUp("Podano błędny numer piosenki").catch((err)=>console.log(err));
        }

        queue.get(msg.guild.id).songs.splice(musicNubmer, 1);

        await msg.followUp("Usunięto piosenkę").catch((err)=>console.log(err));
    }
}
