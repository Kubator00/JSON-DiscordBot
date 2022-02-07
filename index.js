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

const process = require('process')
const databaseRandomMsg = require('./Database/databaseRandomMsg.js');
const channelNameStats = require('./channelNameStats.js');
const autoMessages = require('./autoMessages.js');
const guildJoinMember = require('./guildJoinMember.js');
const advertisement = require('./advertisement.js');
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
      client.user.setActivity(result, { type: 4 })
    }
    catch (err) {
      console.log(`Bot status ${err}`);
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
  console.log(`Memory usage rss, ${process.memoryUsage().rss / 1000000}MB `)
}, 400000);

setInterval(() => { //co godzine zmienia status bota
  (async () => {
    try {
      let result = (await databaseRandomMsg('BOT_STATUS'));
      client.user.setActivity(result, { type: 'PLAYING' })
    }
    catch {
      console.log("Błąd ustawienia statusu bota");
    }
  })();
}, 3600000);


async function block_button(i) {
  i.component.setDisabled(true);
  await i.update({
    components: [
      new MessageActionRow().addComponents(i.component)
    ]
  });
  setTimeout(i.component.setDisabled(false), 10000);
  await i.update({
    components: [
      new MessageActionRow().addComponents(i.component)
    ]
  });
}

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const lolaccount = require('./Commands/SlashCommands/LolApi/Functions/account');
const lolMessage = require('./Commands/SlashCommands/LolApi/Functions/message');
client.on('interactionCreate', async i => {
  if (!i.customId)
    return;

  if (i.customId.slice(0, 7) == 'account') {

    i.component.setDisabled(true);
    await i.update({
      components: [
        new MessageActionRow().addComponents(i.component)
      ]
    });

    await lolaccount(i.message, i.customId.slice(8));
    await lolMessage(i.message, i.customId.slice(8), false);
  }
  if (i.customId.slice(0, 4) == 'live') {

    i.component.setDisabled(true);
    await i.update({
      components: [
        new MessageActionRow().addComponents(i.component)
      ]
    });

    await lolaccount(i.message, i.customId.slice(6));
    await lolMessage(i.message, i.customId.slice(6), false);
  }
});