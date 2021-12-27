const { MessageEmbed } = require('discord.js');
const displayVoiceStats = require("./VoiceStats/displayVoiceStats.js");
const process = require('process')
const gif = require('./Gifs/gif');
const channels = require('./Database/readChannelName');
const date = require('./date');
const checkPremissions = require('./ErrorHandlers/errorHandlers').checkPremissions;

module.exports = (client) => {

  setInterval(() => {
    for (const [key, value] of Object.entries(process.memoryUsage())) {
      console.log(`Memory usage by ${key}, ${value / 1000000}MB `)
    }

    let minute = date.minute();
    let hour = date.hour();

    if (minute == 0) {
      //wysyłanie godziny na kanał
      (async () => {
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          const channel = await channels.fetch_channel(client, await channels.read_channel('hour', guild));
          if (checkPremissions(channel))
            channel.send("Jest godzina " + date.hour() + ":00");
        }
      })();
    }

    // //statystyki, ustawianie nowej daty
    if (hour == 0 && minute == 0) {
      channelNameStatisticsFunctions.new_date(client, channels);
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
          const channel = await channels.fetch_channel(client, await channels.read_channel('bot', guild));
          if (checkPremissions(channel)) {
            channel.send({ embeds: [embed] });
          }
        }
      })();
    }


    if (minute == 0 || minute == 10 || minute == 20 || minute == 30 || minute == 40 || minute == 50) {
      (async () => {
        for (guild of client.guilds.cache.map(guild => guild.id)) {
          const channel = await channels.fetch_channel(client, await channels.read_channel('voice_time_users', guild));
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
          const channel = await channels.fetch_channel(client, await channels.read_channel('gifs', guild));
          if (checkPremissions(channel))
            channel.send(await gif.tenor_gif(await gif.rand_gif_category()));
        }
      }
      )();
    }

  }, 59000);

}




