import poolDB from '../Database/conn.js'


export async function readVoiceStatsFromDatabase(guildId) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`SELECT id_discord, time_on_voice  from public."VOICE_COUNTER_USERS" where id_guild='${guildId}' ORDER BY time_on_voice DESC LIMIT 30;`)
        return result.rows;
    } catch (err) {
        console.error(err);
        throw new Error('Błąd połączenia');
    } finally {
        clientConn?.release();
    }
}

export async function readVoiceStatsFromDatabaseLast7Days(guildId) {
    let clientConn;
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 5));
    const sevenDaysAgoToString = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate()).toISOString().slice(0, 10);
    try {
        clientConn = await poolDB.connect();
        const result = await clientConn.query(`
            SELECT id_discord,  SUM(time_on_voice) as "time_on_voice"
            FROM public."VOICE_COUNTER_USERS_LAST_7_DAYS" 
            where date >= '${sevenDaysAgoToString}'
            AND id_guild = '${guildId}'
            AND id_discord in (
            SELECT id_discord FROM (SELECT id_discord, SUM(time_on_voice) as "time_on_voice" from  public."VOICE_COUNTER_USERS_LAST_7_DAYS" where date >= '${sevenDaysAgoToString}' AND  id_guild = '${guildId}' group by id_discord order by time_on_voice desc) as t1 limit 20)
            GROUP BY id_discord
            ORDER BY time_on_voice desc;
        `);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw new Error('Błąd połączenia');
    } finally {
        clientConn?.release();
    }
}