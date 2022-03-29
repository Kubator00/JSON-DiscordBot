let usersVoiceMap = new Map();
module.exports.usersVoiceMap = usersVoiceMap;
const setStatsOnReady = require('./setStatsOnReady');
const saveStatsInterval = require('./saveStatsInterval');
const actionOnEvent = require('./actionOnEvent');

module.exports = (client) => {
    setStatsOnReady(client);
    saveStatsInterval();
    actionOnEvent(client);
}

