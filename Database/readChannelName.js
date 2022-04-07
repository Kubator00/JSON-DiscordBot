const poolDB = require('./databaseConn.js');


module.exports.read_channel = findChannel;
module.exports.fetch_channel = fetchChannel;
module.exports.check_channel = checkChannel;


async function checkChannel(client, channelRole, msg) {
    const guildId = msg.guild.id;
    let dbResult = await findChannel(channelRole, guildId);
    let channel = await fetchChannel(client, dbResult);

    try {
        if (channel.id !== msg.channel.id) {
            if (!channel.name)
                msg.followUp(`Funkcja aktualnie niedostępna`).catch(err => console.log(err));
            else
                msg.followUp(`Komenda może być tylko użyta na kanale ${channel.name}`).catch(err => console.log(err));
            return false;
        }
    } catch (err) {
        msg.followUp(`Funkcja aktualnie niedostępna`).catch(err => console.log(err));
        return false;
    }

    return true;
}

async function fetchChannel(client, channelDB) {
    if (!channelDB || channelDB.length < 1)
        return false;
    let channel;
    try {
        channel = await client.channels.fetch(channelDB.channel_id);
    } catch (err) {
        console.log(err);
        return false;
    }
    return channel;
}

async function findChannel(channelRole, guildId) {


    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`SELECT channel_id from public."CHANNEL_NAMES" where guild_id='${guildId}' AND role='${channelRole}';`);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        clientConn?.release()
    }

}