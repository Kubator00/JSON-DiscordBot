const date = require('./date');
const channels = require('./Database/readChannelName');
module.exports = { count_members, new_date, count_online_members }

//liczba członków serwera
async function count_members(client) {
  for (guildId of client.guilds.cache.map(guild => guild.id)) {
    const guild = client.guilds.cache.get(guildId);
    const channel = await channels.fetch_channel(client, await channels.read_channel('guild_members_number', guildId));
    try {
      if (channel) {
        if (channel.permissionsFor(channel.guild.me).has("MANAGE_CHANNELS")) {
          const newName = `👦 Członków: ${guild.memberCount.toLocaleString()}`;
          if (channel.name != newName)
            channel.setName(newName);
        }
        else
          console.log(`Brak uprawnień do ustawienia nazwy kanału jako członków serwera na serwerze: ${guild.name}`);
      }
    }
    catch {
      console.log(err);
    }
  }
}

//liczba członków ONLINE serwera
async function count_online_members(client) {
  for (guildId of client.guilds.cache.map(guild => guild.id)) {
    const guild = client.guilds.cache.get(guildId)
    const online_members = guild.presences.cache.filter(member => member.status == 'online').size;
    const channel = await channels.fetch_channel(client, await channels.read_channel('online_members_number', guildId));
    try {
      if (channel) {
        if (channel.permissionsFor(channel.guild.me).has("MANAGE_CHANNELS")) {
          const newName = `✅ Online: ${online_members.toLocaleString()}`;
          if (channel.name != newName)
            channel.setName(newName);
        }
        else
          console.log(`Brak uprawnień do ustawienia nazwy kanału jako online_members na serwerze: ${guild.name}`);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}


//wysyłanie w tytuł kanału daty dzień tygodnia + data
async function new_date(client) {
  for (guildId of client.guilds.cache.map(guild => guild.id)) {
    const channel = await channels.fetch_channel(client, await channels.read_channel('date', guildId));
    try {
      if (channel) {
        if (channel.permissionsFor(channel.guild.me).has("MANAGE_CHANNELS")) {
          const newName = "📅 " + date.day_of_the_week1() + " - " + date.day_message();
          if (channel.name != newName)
            channel.setName(newName);
        }
        else
          console.log(`Brak uprawnień do ustawienia nazwy kanału jako daty na serwerze: ${guild.name}`);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}