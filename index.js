const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});



const key = require('./key.js');
client.login(key.login);
module.exports.client = client;

const date = require('./date.js');
const database = require('./database.js');
const gif = require('./gif_function.js');
const statistics = require('./statistics.js');
const auto = require('./auto_messages.js');
const members = require('./members.js');
const advertisement = require('./advertisement.js');



var serverId;
const channelMembersId = '847534378267312148';
const channelDateId = '847444746993270795';
const channelOnlineMembersId = '847534364626780290';



client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  console.log('Bot jest online!');
  const channel = client.channels.cache.find(channel => channel.name === 'panel')
  serverId = channel.guild.id;

  statistics.new_date(client, serverId, channelDateId);
  statistics.count(client, serverId, channelMembersId);
  statistics.count_online_members(client, serverId, channelOnlineMembersId);

  channel.send("Bot został włączony\n" + date.hour() + ":" + date.minute() + "\n" + date.day_message());

  //status bota
  (async () => {
    let result = (await database.rand_message("BOT_STATUS"));
    console.log("Status: " + result);
    client.user.setActivity(result, { type: 'LISTENING' })

  })();


});




//lista kanalow
var channelList = [];
channelList[0] = "💬ogólne";
channelList[1] = "🕧godzina";
channelList[2] = "🔲gif-y";
channelList[3] = "⚔liga-legend";
channelList[4] = "🎲losowanie";
channelList[5] = "🎮wspólne_granie";
channelList[6] = "👓gejroom";
channelList[7] = "📐czat";
channelList[8] = "🐿wiewiórka";
channelList[9] = "panel";
channelList[10] = "ogłoszenia";
channelList[11] = "📈statystyki";




client.slashCommands = new Collection();
client.messageCommands = new Collection();
['eventHandler', 'messageHandler', 'slashCommandHandler'].forEach(handler => {
  require(`./Handlers/${handler}`)(client);
});



client.on('messageCreate', msg => {

  //wysylanie ogloszen
  advertisement.advert(client, msg, channelList);

});

//automatyczne wiadomosci
auto.auto_messages(client, date, database, gif, serverId, channelDateId, channelList, statistics);

//zmiana czlownkow serwera
members.members(client, channelList, date);



//statystyka członków serwera
setInterval(() => {
  statistics.count(client, serverId, channelMembersId);
  statistics.new_date(client, serverId, channelDateId);
}, 900000);

setInterval(() => {
  statistics.count_online_members(client, serverId, channelOnlineMembersId);
}, 360000);



setInterval(() => { //co godzine zmienia status bota
  (async () => {
    let result = (await database.rand_message("BOT_STATUS"));
    client.user.setActivity(result, { type: 'LISTENING' })
  })();
}, 3600000);





const voiceState = require("./voiceStateUpdate.js");
voiceState(client);




