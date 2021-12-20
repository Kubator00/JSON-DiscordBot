const pg = require('pg');
const errorNotifications = require('../errorNotifications.js')
const connect_database = require('../database/databaseConn.js');
module.exports.read_voice_stats = read_voice_stats;
async function read_voice_stats(guildId) {
    const database = connect_database();
    return new Promise(function (resolve, reject) {
        const clientConn = new pg.Client(database);
        clientConn.connect(err => {
            if (err) return errorNotifications(`Blad polaczenia z baza ${err}`);
        });
        clientConn.query(`SELECT username,nickname, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' ORDER BY time_on_voice DESC LIMIT 15;`, (err, res) => {
            if (err) {
                errorNotifications(`Blad polaczenia z baza ${err}`);
                clientConn.end();
            }
            else {
                clientConn.end();
                resolve(res.rows);
            }
        });
    });
}