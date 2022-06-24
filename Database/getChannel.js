import poolDB from "./conn.js";


export async function findChannel(client, channelRole, guildId) {
    let dbResult;
    try {
        dbResult = await findChannelInDatabase(channelRole, guildId);
        return await fetchChannel(client, dbResult);
    } catch (err) {
        // console.error('Channel doesnt exist')
    }
}

export async function checkIfChannelIsCorrect(client, channelRole, msg) {
    let dbResult, channel;
    const guildId = msg.guild.id;
    try {
        dbResult = await findChannelInDatabase(channelRole, guildId);
        channel = await fetchChannel(client, dbResult);
    } catch (err) {
        msg.followUp(`Funkcja na tym serwerze aktualnie niedostępna`).catch(err => console.log(err));
        return false;
    }

    if (channel.id === msg.channel.id)
        return true;

    if (!channel.name) {
        msg.followUp(`Funkcja na tym serwerze aktualnie niedostępna`).catch(err => console.log(err));
        return false;
    }

    msg.followUp(`Komenda może być tylko użyta na kanale ${channel.name}`).catch(err => console.log(err));
    return false;
}

async function fetchChannel(client, channelDB) {
    let channel;
    if (channelDB?.length < 1)
        return;
    try {
        channel = await client.channels.fetch(channelDB.channel_id);
    } catch (err) {
        throw new Error('Błąd wyszukiwania kanału')
    }
    return channel;
}

async function findChannelInDatabase(channelRole, guildId) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`SELECT channel_id from public."CHANNEL_NAMES" where guild_id='${guildId}' AND role='${channelRole}';`);
        if (result.rows?.length > 0)
            return result.rows[0];
    } catch (err) {
        throw new Error('Błąd połączenia z bazą');
    } finally {
        clientConn?.release()
    }

}