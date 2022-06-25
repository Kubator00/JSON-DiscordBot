import {client} from "../../../index.js";
import {checkIfChannelIsCorrect} from "../../../Database/getChannel.js";
import findMusicYT from "./components/findYtMusic.js";
import addSongToQueue from "./components/addToQueue.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import checkIfUserIsOnVoiceChannel from "../../../Utilities/checkIfUserIsOnVoiceChannel.js";
import autoLeaveChannel from "./components/autoLeave.js";
import sendPlayerEmbed from "./components/sendPlayerEmbed.js";
import playMusic from "./components/playMusic.js";
import isPlayingf from "./components/isPlaying.js";
import getVoiceConnection from "./components/getVoiceChannel.js";
import queue from "./components/queueMap.js";


export default {
    data: new SlashCommandBuilder()
        .setName('graj')
        .setDescription('Odtwarzaj muzyke z YT')
        .addStringOption(option =>
            option
                .setName('nazwa')
                .setDescription('Nazwa lub URL piosenki')
                .setRequired(true)
        ),
    async execute(msg) {
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg) || !checkIfUserIsOnVoiceChannel(msg))
            return;
        let song, voiceChannel;
        const url = msg.options.getString('nazwa');
        const isPlaying = isPlayingf(msg.guild.id);
        try {
            song = await findMusicYT(url);
        } catch (err) {
            msg.followUp(err.message).catch(err => console.error(err));
            return;
        }
        if (!queue.get(msg.guild.id)) {
            try {
                voiceChannel = await getVoiceConnection(msg)
            } catch (err) {
                msg.followUp(err.message).catch(err => console.error(err));
                return;
            }
            setTimeout(() => autoLeaveChannel(msg.guild.id), 5000);
        }
        try {
            await addSongToQueue(msg, song, voiceChannel);
        } catch (err) {
            msg.followUp(err.message).catch(err => console.error(err));
            return;
        }
        if (!isPlaying)
            playMusic(msg.guild.id);

        await sendPlayerEmbed(msg.guild.id);
    },
}

