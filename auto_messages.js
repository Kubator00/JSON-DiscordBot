const { MessageEmbed } = require('discord.js');
const displayVoiceStats = require("./displayVoiceStats.js");

exports.auto_messages = (client, date, database, gif, serverId, channelDateId, channel_list, statistics) => {


  setInterval(() => {

    let minute = date.minute();
    let hour = date.hour();

    if (minute == 0) {
      //wysyłanie godziny na kanał
      var channel = client.channels.cache.find(channel => channel.name === channel_list[1]);
      channel.send("Jest godzina " + date.hour() + ":00");
    }
    //statystyki, ustawianie nowej daty
    if (hour == 0 && minute == 0) {
      statistics.new_date(client, serverId, channelDateId);
    }

    //wysylanie wiadomosci codziennej
    if (hour == 10 && minute == 0) {
      var channel = client.channels.cache.find(channel => channel.name === channel_list[8]);
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        // .setTitle('Codzienna wiadomość')
        .setTitle(`Dzisiaj mamy   📅   ${date.day_of_the_week()}, ${date.full_day_message()}`)
        .setDescription('Miłego dnia 💚')
        .setAuthor('Dzień dobry 🖐')
        .setTimestamp()
      channel.send({ embeds: [embed] });
    }

    //wysylanie losowej wiadomosci na kanal wiewiorka
    if ((hour == 11 && minute == 0) || (hour == 22 && minute == 0)) {
      var channel = client.channels.cache.find(channel => channel.name === channel_list[8]);
      (async () => {
        channel.send( await database.rand_message("DIFFERENT_MESSAGES"));
      })();
    }

    if (minute == 0 || minute == 10 || minute == 20 || minute == 30 || minute == 40 || minute == 50) {
      (async () => {
        var channel = client.channels.cache.find(channel => channel.name === channel_list[11]);
        let messages = await channel.messages.fetch();
        messages.forEach(msg => {
          msg.delete();
        })
        await displayVoiceStats.send_time_voice(channel);
      })();
    }


    //wysyłanie gifow
    if ((minute == 0 || minute == 20 || minute == 40)) {
      var channel = client.channels.cache.find(channel => channel.name === channel_list[2]);
      (async () => {
        channel.send(await gif.tenor_gif(await gif.rand_gif_category()));
      }
      )();
    }
  }, 59000);

}




