const { MessageEmbed } = require('discord.js');
const displayVoiceStats = require("./voiceStats/displayVoiceStats.js");

module.exports = (client, date, database, gif, serverId, channelIDs, channelNames, channelNameStatisticsFunctions, checkPremissions) => {

  setInterval(() => {

    let minute = date.minute();
    let hour = date.hour();

    if (minute == 0) {
      //wysyłanie godziny na kanał
      const channel = client.channels.cache.find(channel => channel.name === channelNames.hourChannel);
      if (checkPremissions(channel, channelNames.hourChannel))
        channel.send("Jest godzina " + date.hour() + ":00");
    }

    //statystyki, ustawianie nowej daty
    if (hour == 0 && minute == 0) {
      channelNameStatisticsFunctions.new_date(client, serverId, channelIDs.channelDateId);
    }

    //wysylanie wiadomosci codziennej
    if (hour == 10 && minute == 0) {
      const channel = client.channels.cache.find(channel => channel.name === channelNames.botChannel);
      if (checkPremissions(channel, channelNames.botChannel)) {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          // .setTitle('Codzienna wiadomość')
          .setTitle(`Dzisiaj mamy   📅   ${date.day_of_the_week()}, ${date.full_day_message()}`)
          .setDescription('Miłego dnia 💚')
          .setAuthor('Dzień dobry 🖐')
          .setTimestamp()
        channel.send({ embeds: [embed] });
      }


    }

    // wysylanie losowej wiadomosci na kanal wiewiorka
    if ((hour == 11 && minute == 0) || (hour == 22 && minute == 0)) {
      const channel = client.channels.cache.find(channel => channel.name === channelNames.botChannel);
      if (checkPremissions(channel, channelNames.botChannel)) {
        (async () => {
          channel.send(await database.rand_message("DIFFERENT_MESSAGES"));
        })();
      }
    }

    if (minute == 0 || minute == 10 || minute == 20 || minute == 30 || minute == 40 || minute == 50) {
      (async () => {
        const channel = client.channels.cache.find(channel => channel.name === channelNames.voiceStatisticsChannel);
        if (checkPremissions(channel, channelNames.voiceStatisticsChannel)) {
          let messages = await channel.messages.fetch();
          messages.forEach(msg => {
            msg.delete();
          })
          await displayVoiceStats.send_time_voice(channel);
        }
      })();
    }


    //   //wysyłanie gifow
    if ((minute == 0 || minute == 20 || minute == 40)) {
      const channel = client.channels.cache.find(channel => channel.name === channelNames.gifsChannel);
      if (checkPremissions(channel, channelNames.gifsChannel)) {
        (async () => {
          channel.send(await gif.tenor_gif(await gif.rand_gif_category()));
        }
        )();
      }
    }

  }, 59000);

}




