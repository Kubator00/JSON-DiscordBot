const pg = require('pg');
const connect_database = require('../../Database/databaseConn.js');
module.exports.read_voice_stats = read_voice_stats;
async function read_voice_stats(guildId) {
    const database = connect_database();
    const clientConn = new pg.Client(database);
    let result = [];
    try {
        await clientConn.connect();
        await clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' ORDER BY time_on_voice DESC LIMIT 30;`)
            .then(res => {
                const rows = res.rows;
                rows.map(row => {
                    result.push(row);
                })
            });
    }
    catch (err) {
        console.log(err);
    }
    await clientConn.end();
    return result;
}