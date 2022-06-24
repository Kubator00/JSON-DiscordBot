import {client} from "../../../index.js";
import {checkIfChannelIsCorrect} from "../../../Database/getChannel.js";
import findPlaylistYT from "./components/findYtPlaylist.js";
import addSongToQueue from "./components/addToQueue.js";
import embedPlayer from "./components/sendPlayerEmbed.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import checkIfUserIsOnVoiceChannel from "../../../Utilities/checkIfUserIsOnVoiceChannel.js";
import isPlayingf from "./components/isPlaying.js";
import playMusic from "./components/playMusic.js";
import autoLeaveChannel from "./components/autoLeave.js";
import queue from "./components/queueMap.js";
import getVoiceConnection from "./components/getVoiceChannel.js";

export default {
    data: new SlashCommandBuilder()
        .setName('graj_liste')
        .setDescription('Odtwarzaj playliste z YT')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('URL playlisty')
                .setRequired(true)
        ),
    async execute(msg) {
        if (!await checkIfChannelIsCorrect(client, 'music_bot', msg) || !checkIfUserIsOnVoiceChannel(msg))
            return;
        const url = msg.options.getString('url');
        const isPlaying = isPlayingf(msg);
        let musicList, voiceChannel;

        try {
            musicList = await findPlaylistYT(msg, url);
        } catch (err) {
            msg.followUp('Nieprawidłowy adres');
            return;
        }

        if (!queue.get(msg.guild.id)) {
            try {
                voiceChannel = await getVoiceConnection(msg)
            } catch (err) {
                msg.followUp('Błąd połączenia z kanałem').catch(err => console.log(err));
                return;
            }
            setTimeout(() => autoLeaveChannel(msg.guild.id), 5000);
        }

        for (let music of musicList)
            await addSongToQueue(msg, music, voiceChannel)

        if (!isPlaying)
            playMusic(msg.guild.id);
        await embedPlayer(msg.guild.id);
    }
}

