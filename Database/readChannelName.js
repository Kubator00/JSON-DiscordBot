import poolDB from "./databaseConn.js";


export async function checkIfChannelIsCorrect(client, channelRole, msg) {
    const guildId = msg.guild.id;
    let dbResult = await findChannelInDatabase(channelRole, guildId);
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

export async function findChannel(client, channelRole, guildId) {
    let dbResult = await findChannelInDatabase(channelRole, guildId);
    return await fetchChannel(client, dbResult);
}


async function fetchChannel(client, channelDB) {
    if (!channelDB || channelDB.length < 1)
        return null;
    let channel;
    try {
        channel = await client.channels.fetch(channelDB.channel_id);
    } catch (err) {
        console.log(err);
        return null;
    }
    return channel;
}

async function findChannelInDatabase(channelRole, guildId) {
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