const date = require('./date.js');

module.exports.count = count;
module.exports.new_date = new_date;
module.exports.count_online_members = count_online_members;




//liczba członków serwera
function count(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;
  var guild = client.guilds.cache.get(serverId)
  const channel = guild.channels.cache.get(channelId)

  channel.setName(`👦 Członków: ${guild.memberCount.toLocaleString()}`).catch(error => console.log("Blad ustawienia ilosci członkow w tytule kanalu"));
  return 0;
}

//liczba członków ONLINE serwera
async function count_online_members(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;
  var guild = client.guilds.cache.get(serverId)

  const online_members = guild.presences.cache.filter(member => member.status == 'online').size
  const channel = guild.channels.cache.get(channelId)
  channel.setName(`✅ Online: ${online_members.toLocaleString()}`).catch(error => console.log("Blad ustawienia ilosci członkow online w tytule kanalu"));

  return 0;
}


//wysyłanie w tytuł kanału daty dzień tygodnia + data
function new_date(client, serverId, channelId) {
  if (serverId == undefined || channelId == undefined)
    return;
  var guild = client.guilds.cache.get(serverId);
  const channel = guild.channels.cache.get(channelId);
  channel.setName("📅 " + date.day_of_the_week1() + " - " + date.day_message()).catch(error => console.log("Blad ustawienia daty w tytule kanalu"));
  return 0;
}