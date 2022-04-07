const poolDB = require('../../Database/databaseConn.js');
module.exports.read_voice_stats = read_voice_stats;

async function read_voice_stats(guildId) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' ORDER BY time_on_voice DESC LIMIT 30;`)
        return result.rows;
    } catch (err) {
        console.log(err);
        return null;
    } finally{
        clientConn?.release();
    }
}