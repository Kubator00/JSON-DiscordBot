# DiscordBot-PatrickBot

Patrick is Discord Bot for Polish servers using PostgresSQL database.

<h1>❗Features</h1>
<ul>
  <li> track time spent by users on voice channels </li>
  <li> music bot </li>
  <li> gifs from Tenor (Tenor token required) </li>
  <li> card game </li>
  <li> display number of online/total members and current date as voice channel names</li>
  <li> random number generator </li>
  <li> and more... </li>
</ul>  
 <b> League of Legends: </b>
 <ul>
 riot token required:
    <ul>
      <li> live matches </li>
      <li> history games </li>
      <li> champions maestry </li>  
     </ul>
 riot token not required:
   <ul>
      <li> knowledge quiz </li>
      <li> random team generator </li>
   </ul>
 </ul>

 
<h2>✅ Statistics as Channel Names </h2>
  
![obraz](https://user-images.githubusercontent.com/71319403/162089267-e20ed7da-df24-4235-89c6-c09a62b391c2.png)


 <h2>🎵Music Bot🎵</h2> 
 
![s3](https://user-images.githubusercontent.com/71319403/162534333-a803f0fd-8949-4683-a131-c9ca4e4aaed1.jpg)


<h2>🏆Time spent on voice channel ranking </h2>

![s1jpg](https://user-images.githubusercontent.com/71319403/162534096-d0ce6f7c-1cd0-4ca2-b4fd-11da8a99cecb.jpg)


<h2>🎮 League of Legends account data <h2> 
  

![s2](https://user-images.githubusercontent.com/71319403/162534105-10f85350-e1b9-4768-a2b1-a5217f217e10.jpg)



<h1>⚙️Set Up</h1>
Create environmental variables:
<ol>
  <li>
      <b>DISCORD_TOKEN</b> <- your personal discord application token
  </li>
  <li>
       <b>LOL_TOKEN</b> <- your personal riot api key 
  </li>
  <li>
       <b>TENOR_TOKEN</b> <- your personal tenor token
  </li>
  <li>
  <b>POSTGRESSQL DATA:</b> <- postgres database  
    <ul> 
      <li> DATABASE_HOST    </li>
      <li> DATABASE_NAME    </li>
      <li> DATABASE_PASSWORD</li>
      <li> DATABASE_USER    </li> 
    </ul>
  </li>
</ol>
  In Database you must create 5 tables which are in file "PostgresSQL.txt". 
  The most important table is "CHANNEL_NAMES". <br/>
  It is used to separate features into particular guild channels. <br/>
  Add to this table records with the following pattern: <br/>
  INSERT INTO public."CHANNEL_NAMES"(guild_id, role, channel_id) VALUES ('YOU_GUILD_ID', 'ROLE', 'YOUR_CHANNEL_ID');<br/>
  List of possible channels roles:
  <ul>
  <b>text channels:</b>
    <ul>
      <li><b>voice_time_users</b> - display users who have the most time on voice channels </li>
      <li><b>gifs</b> - sends gif every 15 min </li>
      <li><b>guild_members_update</b> - sends welcome messages </li>
      <li><b>music_bot</b> - display audio player <b>BOT WILL DELETE ALL PREVIOUS MESSAGES AT THIS CHANNEL </b>  </li>  
      <li><b>hour</b> - sends notifications on the full hours  </li>  
      <li><b>advertisment</b> - sends messages on behalf of the bot (pattern: CHANNEL_NAME:YOUR_MSG) <b> ONLY ADMINISTRATORS SHOULD HAVE ACCESS </b></li>
   </ul>
  <b>voice channels:</b>
    <ul>
      <li><b>guild_members_number</b> -  display total members of guild </li>  
      <li><b>online_members_number</b> - display online members of guild </li>
      <li><b>date</b> - display day of the week </li>
    </ul>
  </ul>
    
  
  In the table "GIF_CATEGORY" insert the keywords which you want to be displayed in the gif channel. 
  The keyword is chosen randomly each time. <br/>
  Add records with the following pattern: <br/>
  INSERT INTO public."GIF_CATEGORY" (value) VALUES ('YOUR_KEYWORD');



