import poolDB from "./conn.js";

export default async function getTableFromDb(tableName) {
    let clientConn;
    try {
        clientConn = await poolDB.connect();
        const results = await clientConn.query(`SELECT * from public."${tableName}";`)
        return results.rows;
    } catch (err) {
        console.error(err);
        throw new Error('Błąd łączenia z bazą danych');
    } finally {
        clientConn?.release();
    }
}

