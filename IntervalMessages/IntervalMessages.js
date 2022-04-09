import * as date from '../Utilities/date.js';
import sendVoiceTimeRanking from "./sendVoiceTimeRanking.js";
import sendGif from "./sendGif.js";
import sendFullHourMessage from "./sendFullHourMessage.js";
import {changeVoiceChannelName} from "../StatisticsAsVoiceChannelNames/changeVoiceChannelName.js";
import {day_of_the_week} from "../Utilities/date.js";

export default (client) => {
    setInterval(() => {
        let minute = date.minute();
        let hour = date.hour();
        for (let guild of client.guilds.cache) {
            if (minute === 0)
                sendFullHourMessage(client, guild[1]?.id);
            if (hour === 0 && minute === 0) //new date as voice channel name
                changeVoiceChannelName('date', guild, "┃ 📅 ┃ " + day_of_the_week());

            if (minute === 0 || minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50)
                sendVoiceTimeRanking(client, guild[1]?.id);

            if (minute === 0 || minute === 20 || minute === 40)
                sendGif(client, guild[1]?.id);
        }
    }, 59990);
}




