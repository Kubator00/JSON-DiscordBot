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


const discordToken = require('./discordToken.js');
client.login(discordToken.login);
module.exports.client = client;

const date = require('./date.js');
const database = require('./database.js');
const gif = require('./gif_function.js');
const channelNameStatisticsFunctions = require('./channelNameStatisticsFunctions.js');
const autoMessages = require('./auto_messages.js');
const joinMembers = require('./joinMembers.js');
// const advertisement = require('./advertisement.js');
const channelNames = require('./channelNames');
const channelIDs = require('./channelIDs');
const errorNotifications = require('./errorNotifications');
const checkPremissions = require('./checkPremissions.js');
const saveOnlineVoiceTime = require("./voiceStats/saveOnlineVoiceTime");

let serverId;

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log('Bot jest online!');
  const channel = client.channels.cache.find(channel => channel.name === channelNames.panelChannel)
  serverId = client.guilds.cache.map(guild => guild.id);
  serverId = String(serverId[0]);

  if (checkPremissions(channel, channelNames.panelChannel))
    channel.send("Bot został włączony\n" + date.hour() + ":" + date.minute() + "\n" + date.day_message());

  //status bota
  (async () => {
    let result = (await database.rand_message("BOT_STATUS"));
    console.log("Status: " + result);
    try {
      client.user.setActivity(result, { type: 'LISTENING' })
    }
    catch {
      errorNotifications("Błąd ustawienia statusu bota");
    }

  })();

  channelNameStatisticsFunctions.count_members(client, serverId, channelIDs.channelMembersId);
  channelNameStatisticsFunctions.new_date(client, serverId, channelIDs.channelDateId);
  channelNameStatisticsFunctions.count_online_members(client, serverId, channelIDs.channelOnlineMembersId);

});


client.slashCommands = new Collection();
client.messageCommands = new Collection();
['eventHandler', 'messageHandler', 'slashCommandHandler'].forEach(handler => {
  require(`./Handlers/${handler}`)(client);
});


// client.on('messageCreate', msg => {

//   //wysylanie ogloszen
//   advertisement.advert(client, msg, channelNames, checkPremissions);

// });

// //automatyczne wiadomosci
autoMessages(client, date, database, gif, serverId, channelIDs, channelNames, channelNameStatisticsFunctions, checkPremissions);

// //zmiana czlownkow serwera
joinMembers(client, channelNames, date, checkPremissions);



//statystyka członków serwera
setInterval(() => {
  channelNameStatisticsFunctions.count_members(client, serverId, channelIDs.channelMembersId);
  channelNameStatisticsFunctions.new_date(client, serverId, channelIDs.channelDateId);
}, 10000);


setInterval(() => {
  channelNameStatisticsFunctions.count_online_members(client, serverId, channelIDs.channelOnlineMembersId);
}, 360000);



setInterval(() => { //co godzine zmienia status bota
  (async () => {
    let result = (await database.rand_message("BOT_STATUS"));
    client.user.setActivity(result, { type: 'LISTENING' })
  })();
}, 3600000);



saveOnlineVoiceTime(client);

