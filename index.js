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
const database = require('./database/database.js');
const gif = require('./gif_function.js');
const channelNameStatisticsFunctions = require('./channelNameStatisticsFunctions.js');
const autoMessages = require('./auto_messages.js');
const joinMembers = require('./joinMembers.js');
// const advertisement = require('./advertisement.js');
const errorNotifications = require('./errorNotifications');
const checkPremissions = require('./checkPremissions.js');
const saveOnlineVoiceTime = require("./voiceStats/saveOnlineVoiceTime");
const channelNames = require('./database/readChannelName.js');



client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);

  //wysyłanie wiadomości na kanał panel

  console.log("Zalogowany na serwerach:");
  for (guild of client.guilds.cache) {
    console.log(guild[1].name);
  }

  (async () => {
    for (guildId of client.guilds.cache.map(guild => guild.id)) {
      const channel = await channelNames.fetch_channel(client, await channelNames.read_channel('panel', guildId));
      if (checkPremissions(channel))
        channel.send("Bot został włączony\n" + date.hour() + ":" + date.minute() + "\n" + date.day_message());
    }
  })();

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

  channelNameStatisticsFunctions.count_members(client, channelNames);
  channelNameStatisticsFunctions.new_date(client, channelNames);
  channelNameStatisticsFunctions.count_online_members(client, channelNames);

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
autoMessages(client, date, gif, channelNames, channelNameStatisticsFunctions, checkPremissions);

// //zmiana czlownkow serwera
joinMembers(client, channelNames, date, checkPremissions);



// statystyka członków serwera
setInterval(() => {
  channelNameStatisticsFunctions.count_members(client, channelNames);
  channelNameStatisticsFunctions.new_date(client, channelNames);
}, 600000);


setInterval(() => {
  channelNameStatisticsFunctions.count_online_members(client, channelNames);
}, 400000);



setInterval(() => { //co godzine zmienia status bota
  (async () => {
    let result = (await database.rand_message("BOT_STATUS"));
    client.user.setActivity(result, { type: 'LISTENING' })
  })();
}, 3600000);



saveOnlineVoiceTime(client);

