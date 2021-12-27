const pg = require('pg');
const errorNotifications = require('../ErrorHandlers/errorHandlers.js').errorNotifications;
const connect_database = require('./databaseConn.js');


module.exports.read_channel = read_channel;
module.exports.fetch_channel = fetch_channel;

async function fetch_channel(client, channelDB) {
    if (channelDB.length < 1)
        return false;
    let channel;
    try {
        channel = await client.channels.fetch(channelDB[0].channel_id);
    }
    catch (err) {
        errorNotifications(`Kanał nie znajduje się na serwerze ${err}`);
    }
    return channel;
}

async function read_channel(channelRole, guildId) {
    const database = connect_database();
    return new Promise(function (resolve, reject) {
        const clientConn = new pg.Client(database);
        clientConn.connect(err => {
            if (err) return errorNotifications(`Blad polaczenia z baza ${err}`);
        });

        clientConn.query(`SELECT channel_id,name from public."CHANNEL_NAMES" where guild_id='${guildId}' AND role='${channelRole}';`, (err, res) => {
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

