# DiscordBot-JSON

JSON is Discord Bot for Polish servers using PostgresSQL database.

<h1>❗Features</h1>
<ul>
  <li> Time Counter - count time spent by user on voice channels </li>
  <li> MusicBot - listen music from YT </li>
  <li> Gifs - get gifs from Tenor API in particular text channel (Tenor Token required) </li>
  <li> LeagueOfLegends - search live matches, history game and champions mastery  (Riot Token required) </li>
  <li> LeagueOfLegends Quiz - compete with your friends in the quiz  (Riot Token not required) </li>
  <li> Blackjack game - play a card game against bot and friend </li>
  <li> Statistics - display number of online/total members and current date as voice channel names  </li>
  <li> Draw Number - draw number from range </li>
  <li> and more... </li>

</ul>  
 
 <h2>🎵Music Bot🎵</h2> 
 
![s2](https://user-images.githubusercontent.com/71319403/162446809-90bf3eb5-d84c-4137-810b-0bcfcf166455.jpg)

<h2>🏆VoiceTime Ranking </h2>

![s1](https://user-images.githubusercontent.com/71319403/162446801-dc0c8215-9a56-4bbb-8df5-de06d95b7f1f.jpg)


<h2>🎮 LeagueofLegends Functions<h2> 
  
![obraz](https://user-images.githubusercontent.com/71319403/162447266-e1ca81b8-29a8-4455-b090-8bb693ade74b.png)



<h2>✅ Statistics as Channel Names </h2>
  
![obraz](https://user-images.githubusercontent.com/71319403/162089267-e20ed7da-df24-4235-89c6-c09a62b391c2.png)

<br/><br/>
<h1>⚙️Set Up</h1>
You need create some environmental variable:
<ol>
  <li>
      <b>DISCORD_TOKEN</b> <- your personal discord application token
  </li>
  <li>
       <b>LOL_TOKEN</b> <- your personal riot api key to use LolApi functions
  </li>
  <li>
       <b>TENOR_TOKEN</b> <- your personal tenor to use gif functions
  </li>
  <li>
    <b>POSTGRESSQL DATA:</b>
    <ul> 
      <li> DATABASE_HOST    </li>
      <li> DATABASE_NAME    </li>
      <li> DATABASE_PASSWORD</li>
      <li> DATABASE_USER    </li> 
    </ul>
  </li>
  In Database you must create 4 tables which are in file "PostgresSQL.txt". 
  Table "CHANNEL_NAMES" contains columns: channelId, guildId, and channel role. This table
  is used to separate bot functions into particular channels <br/>
  Possible channel roles:
  <ul>
  <li><b>voice_time_users</b> - text channel, display voice time ranking </li>
  <li><b>lol_statistics</b> - text channel, used to LolApi functions </li>
  <li><b>gifs</b> - text channel, bot sends gif every 15 min </li>
  <li><b>advertisment</b> - text channel, channel to send messages on behalf of the bot </li>
  <li><b>guild_members_update</b> - text channel, sending welcome messages  </li>
  <li><b>music_bot</b> - text channel, interaction with music functions  </li>  
  <li><b>hour</b> - text channel, bot sends notification on the full hour  </li>  
  <li><b>guild_members_number</b> - voice channel, display total members of guild as channel name </li>  
  <li><b>online_members_number</b> - voice channel, display online members of guild as channel name </li>
  <li><b>date</b> - voice channel, display day of the week as channel name </li>
  </ul>
    
  Add to database rows with the following pattern: 
  INSERT INTO public."CHANNEL_NAMES"(guild_id, role, channel_id) VALUES (YOU_GUILD_ID, ROLE, CHANNEL_ID);
  
  In the table "GIF_CATEGORY" insert the categories which you want to be displayed in the text channel with the role of "gifs". 
  
 </ol>
