const { MessageEmbed } = require('discord.js');
const displayVoiceStats = require("./voiceStats/displayVoiceStats.js");

module.exports = (client, date, gif, channelNames, channelNameStatisticsFunctions, checkPremissions) => {

  setInterval(() => {

    let minute = date.minute();
    let hour = date.hour();

    if (minute == 0) {
      //wysyłanie godziny na kanał
      (async () => {
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          console.log(guild);
          const channel = await channelNames.fetch_channel(client, await channelNames.read_channel('hour', guild));
          if (checkPremissions(channel))
            channel.send("Jest godzina " + date.hour() + ":00");
        }
      })();
    }

    // //statystyki, ustawianie nowej daty
    if (hour == 0 && minute == 0) {
      channelNameStatisticsFunctions.new_date(client, channelNames);
    }

    // //wysylanie wiadomosci codziennej
    if (hour == 10 && minute == 0) {
      (async () => {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Dzisiaj mamy   📅   ${date.day_of_the_week()}, ${date.full_day_message()}`)
          .setDescription('Miłego dnia 💚')
          .setAuthor('Dzień dobry 🖐')
          .setTimestamp()
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          const channel = await channelNames.fetch_channel(client, await channelNames.read_channel('bot', guild));
          if (checkPremissions(channel)) {
            channel.send({ embeds: [embed] });
          }
        }
      })();
    }


    if (minute == 0 || minute == 10 || minute == 20 || minute == 30 || minute == 40 || minute == 50) {
      (async () => {
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          const channel = await channelNames.fetch_channel(client, await channelNames.read_channel('voice_time_users', guild));
          if (checkPremissions(channel)) {
            let messages = await channel.messages.fetch();
            messages.forEach(msg => {
              msg.delete();
            })
            await displayVoiceStats.send_time_voice(channel, guild);
          }
        }
      })();
    }


    //wysyłanie gifow
    if ((minute == 0 || minute == 20 || minute == 40)) {
      (async () => {
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          const channel = await channelNames.fetch_channel(client, await channelNames.read_channel('gifs', guild));
          if (checkPremissions(channel))
            channel.send(await gif.tenor_gif(await gif.rand_gif_category()));
        }
      }
      )();
    }

  }, 59000);

}




