let usersVoiceMap = new Map();
export {usersVoiceMap};
import setStatsOnReady from "./saveStatsComponents/setStatsOnReady.js";
import saveStatsInterval from "./saveStatsComponents/saveStatsInterval.js";
import saveStatsOnLeave from "./saveStatsComponents/saveStatsOnLeave.js";

export default (client) => {
    setStatsOnReady(client);
    saveStatsInterval();
    saveStatsOnLeave(client);
}

