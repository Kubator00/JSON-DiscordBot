import poolDB from '../../Database/databaseConn.js';

export default async () => {
    setInterval(async () => {
        let conn;
        const deleteDate = new Date(new Date().setDate(new Date().getDate() - 9));
        const deleteDateToString = new Date(deleteDate.getFullYear(), deleteDate.getMonth(), deleteDate.getDate()).toUTCString();
        try {
            conn = await poolDB.connect();
            conn.query(`DELETE FROM public."VOICE_COUNTER_USERS_LAST_7_DAYS" WHERE date < '${deleteDateToString}';`);
            console.log("Old VoiceCounter stats has been removed")
        } catch (err) {
            console.error(err);
        } finally {
            conn?.release();
        }
    }, 18000000);
}