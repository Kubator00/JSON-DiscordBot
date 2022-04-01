const pg = require('pg');
const connect_database = require('./databaseConn.js');


module.exports.read_channel = read_channel;
module.exports.fetch_channel = fetch_channel;
module.exports.check_channel = check_channel;


async function check_channel(client, channelRole, msg) {
    const guildId = msg.guild.id;
    let dbResult = await read_channel(channelRole, guildId);
    let channel = await fetch_channel(client, dbResult);
    if (!channel)
        msg.followUp(`Funkcja aktualnie niedostępna`);
    if (channel.id != msg.channel.id) {
        if (!channel.name)
            msg.followUp(`Funkcja aktualnie niedostępna`);
        else
            msg.followUp(`Komenda może być tylko użyta na kanale ${channel.name}`);
        return false;
    }
    return true;
}

async function fetch_channel(client, channelDB) {
    if (!channelDB || channelDB.length < 1)
        return false;
    let channel;
    try {
        channel = await client.channels.fetch(channelDB.channel_id);
    }
    catch (err) {
        console.log(err);
    }
    return channel;
}

async function read_channel(channelRole, guildId) {
    const database = connect_database();
    const clientConn = new pg.Client(database);
    let result = [];
    try {
        await clientConn.connect();
        await clientConn.query(`SELECT channel_id from public."CHANNEL_NAMES" where guild_id='${guildId}' AND role='${channelRole}';`)
            .then(res => {
                const rows = res.rows;
                rows.map(row => {
                    result.push(row);
                })
            });
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await clientConn.end();
    }
    return result[0];
}