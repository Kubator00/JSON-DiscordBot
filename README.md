# DiscordBot-Wiewiorka

Wiewiorka is Discord Bot for Polish servers used on PostgresSQL database.


<h1>Features</h1>
<ul>
  <li> counting time which user spent on voice time channels  </li>
  <li> integrates with Riot Api allows searching live matches, history game and champions mastery in League Of Legends </li>
  <li> listen music from YT </li>
  <li> get gifs from Tenor API in particular text channel </li>
  <li> display number of online, total members and current date as voice channel names  </li>
  <li> drawing numbers from the range  </li>
  <li> blackjack game </li>
  <li> LeagueOfLegends quiz, compete with your friends in game knowledge (Riot Token not required )</li>
</ul>  

<h1>Set up</h1>
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
    <b>POSTGRESSQL CONNECTION</b> <- database connection data
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
  <li><b>guild_members_number</b> - voice channel, display total members of guild  </li>  
  <li><b>online_members_number</b> - voice channel, display online members of guild  </li>
  <li><b>date</b> - voice channel, display day of the week and current date </li>
  </ul>
    
  Add to database rows with the following pattern: 
  INSERT INTO public."CHANNEL_NAMES"(guild_id, role, channel_id) VALUES (YOU_GUILD_ID, ROLE, CHANNEL_ID);
  
  In the table "GIF_CATEGORY" complete the categories to be displayed in the text channel with the role of "gifs". 
  
 </ol>
