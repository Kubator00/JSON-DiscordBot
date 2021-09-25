const date = require('./date.js');
const errorNotifications = require('./errorNotifications');

module.exports.count_members = count_members;
module.exports.new_date = new_date;
module.exports.count_online_members = count_online_members;

//liczba członków serwera
function count_members(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;

  const guild = client.guilds.cache.get(serverId)
  const channel = guild.channels.cache.get(channelId)
  if (channel)
    channel.setName(`👦 Członków: ${guild.memberCount.toLocaleString()}`);
  else
    errorNotifications("Blad ustawienia nazwy kanalu z liczba czlonkow serwera")

}

//liczba członków ONLINE serwera
async function count_online_members(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;
  const guild = client.guilds.cache.get(serverId)

  const online_members = guild.presences.cache.filter(member => member.status == 'online').size
  const channel = guild.channels.cache.get(channelId)
  if (channel)
    channel.setName(`✅ Online: ${online_members.toLocaleString()}`);
  else
    errorNotifications("Blad ustawienia nazwy kanalu z liczba online członkow serwera")

}


//wysyłanie w tytuł kanału daty dzień tygodnia + data
function new_date(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;
  const guild = client.guilds.cache.get(serverId);
  const channel = guild.channels.cache.get(channelId);
  if (channel)
    channel.setName("📅 " + date.day_of_the_week1() + " - " + date.day_message());
  else
    errorNotifications("Blad ustawienia nazwy kanalu z data")

}