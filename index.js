import {Client, Intents, Collection} from 'discord.js';
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});
import discordToken from'./discordToken.js';
client.login(discordToken.login);
export {client};

import eventHandler from "./Handlers/eventHandler.js";
import messageHandler from "./Handlers/messageHandler.js";
import slashCommandHandler from "./Handlers/slashCommandHandler.js";
import buttonHandler from "./Handlers/buttonHandler.js";

client.slashCommands = new Collection();
client.messageCommands = new Collection();
client.buttons = new Collection();
client.selectMenu = new Collection();

eventHandler(client);
messageHandler(client);
slashCommandHandler(client);
buttonHandler(client);

import intervalMessages from './IntervalMessages/IntervalMessages.js'
import guildJoinMember from './guildJoinMember.js'
import saveOnlineVoiceTime from './VoiceStats/saveOnlineVoiceTime.js'
import changeBotStatus from "./BotStatus/changeBotStatus.js";
import advertisement from "./advertisement.js";
import guildStatsAsVoiceChannelsInInterval from './StatisticsAsVoiceChannelNames/setStatisticsInInterval.js'

intervalMessages(client);
guildJoinMember(client);
saveOnlineVoiceTime(client);
changeBotStatus(client);
advertisement(client);
guildStatsAsVoiceChannelsInInterval();

client.once('ready', () => {
    console.log(`Logged as ${client.user.tag}!`);
    console.log("Logged on servers:");
    for (let guild of client.guilds.cache) {
        console.log(`-${guild[1].name}`);
    }
});







