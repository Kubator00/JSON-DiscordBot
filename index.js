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


const databaseRandomMsg = require('./Database/databaseRandomMsg.js');
const channelNameStats = require('./channelNameStats.js');
const autoMessages = require('./autoMessages.js');
const guildJoinMember = require('./guildJoinMember.js');
const advertisement = require('./advertisement.js');
const errorNotifications = require('./ErrorHandlers/errorHandlers.js').errorNotifications;
const saveOnlineVoiceTime = require("./VoiceStats/saveOnlineVoiceTime");
const channels = require('./Database/readChannelName');

module.exports.client = client;



client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log("Zalogowany na serwerach:");
  for (guild of client.guilds.cache) {
    console.log(guild[1].name);
  }

  //status bota
  (async () => {
    let result = (await databaseRandomMsg("BOT_STATUS"));
    console.log("Status: " + result);
    try {
      client.user.setActivity(result, { type: 'LISTENING' })
    }
    catch {
      errorNotifications("Błąd ustawienia statusu bota");
    }

  })();

  channelNameStats.count_members(client);
  channelNameStats.new_date(client);
  channelNameStats.count_online_members(client);

});


client.slashCommands = new Collection();
client.messageCommands = new Collection();
['eventHandler', 'messageHandler', 'slashCommandHandler'].forEach(handler => {
  require(`./Handlers/${handler}`)(client);
});



advertisement(client);
autoMessages(client);
guildJoinMember(client);
saveOnlineVoiceTime(client);

setInterval(() => {
  channelNameStats.count_members(client, channels);
  channelNameStats.new_date(client, channels);
}, 600000);
setInterval(() => {
  channelNameStats.count_online_members(client, channels);
}, 400000);

setInterval(() => { //co godzine zmienia status bota
  (async () => {
    try {
      let result = (await databaseRandomMsg("BOT_STATUS"));
      client.user.setActivity(result, { type: 'LISTENING' })
    }
    catch {
      errorNotifications("Błąd ustawienia statusu bota");
    }
  })();
}, 3600000);




