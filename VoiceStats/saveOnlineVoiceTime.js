let usersVoiceMap = new Map();
module.exports.usersVoiceMap = usersVoiceMap;
const setStatsOnReady = require('./saveStatsComponents/setStatsOnReady');
const saveStatsInterval = require('./saveStatsComponents/saveStatsInterval');
const saveStatsOnLeave = require('./saveStatsComponents/saveStatsOnLeave');

module.exports = (client) => {
    setStatsOnReady(client);
    saveStatsInterval();
    saveStatsOnLeave(client);
}

