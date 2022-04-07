const { Client, Intents, Collection } = require('discord.js');
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

const process = require('process')
const channelNameGuildStats = require('./channelNamesGuildStats.js');
const autoMessages = require('./autoMessages.js');
const guildJoinMember = require('./guildJoinMember.js');
const advertisement = require('./advertisement.js');
const saveOnlineVoiceTime = require("./VoiceStats/saveOnlineVoiceTime");
const channels = require('./Database/readChannelName');
const changeBotStatus=require('./BotStatus/changeBotStatus');
module.exports.client = client;

const discordToken = require('./discordToken.js');
client.login(discordToken.login);


client.slashCommands = new Collection();
client.messageCommands = new Collection();
client.buttons = new Collection();
client.selectMenu = new Collection();
['eventHandler', 'messageHandler', 'slashCommandHandler', 'buttonHandler'].forEach(handler => {
  require(`./Handlers/${handler}`)(client);
});


advertisement(client);
autoMessages(client);
guildJoinMember(client);
saveOnlineVoiceTime(client);
changeBotStatus(client);

setInterval(() => {
  channelNameGuildStats.countTotalMembers(client);
  channelNameGuildStats.countOnlineMembers(client);
}, 600000);


setInterval(() => {
  channelNameGuildStats.countOnlineMembers(client);
  console.log(`Memory usage rss, ${process.memoryUsage().rss / 1000000}MB `)
}, 400000);


client.once('ready', () => {
  console.log(`Logged as ${client.user.tag}!`);
  channelNameGuildStats.currentDate(client);
  channelNameGuildStats.countTotalMembers(client);
  channelNameGuildStats.countOnlineMembers(client);
  console.log("Logged on servers:");
  for (let guild of client.guilds.cache) {
    console.log(`-${guild[1].name}`);
  }
});







