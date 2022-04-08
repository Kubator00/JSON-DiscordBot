import poolDB from '../../../../Database/databaseConn.js';


export default async function readLolQuizStats(guildId) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        let result = await clientConn.query(`SELECT id_discord, correct_answers, wrong_answers  from public."LOL_QUOTES_STATS" where id_guild='${guildId}' ORDER BY correct_answers+wrong_answers DESC LIMIT 20;`);
        return result.rows;
    } catch (err) {
        console.log(err)
        return null;
    } finally {
        clientConn?.release();
    }

}