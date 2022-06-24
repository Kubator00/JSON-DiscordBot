import * as date from '../Utilities/date.js';
import sendVoiceTimeRanking from "./sendVoiceTimeRanking.js";
import sendGif from "./sendGif.js";
import sendFullHourMessage from "./sendFullHourMessage.js";
import {changeVoiceChannelName} from "../StatisticsAsVoiceChannelNames/changeVoiceChannelName.js";
import {dayOfTheWeek} from "../Utilities/date.js";

export default (client) => {
    setInterval(() => {
        let minute = date.minute();
        let hour = date.hourAsString();
        for (let guild of client.guilds.cache) {
            if (minute === 0)
                sendFullHourMessage(client, guild[1]?.id);
            if (hour === 0 && minute === 0) //new date as voice channel name
                changeVoiceChannelName('date', guild, "┃ 📅 ┃ " + dayOfTheWeek());

            if (minute % 10 === 0)
                sendVoiceTimeRanking(client, guild[1]?.id);

            if (minute === 0 || minute === 20 || minute === 40)
                sendGif(client, guild[1]?.id);
        }
    }, 59990);
}




