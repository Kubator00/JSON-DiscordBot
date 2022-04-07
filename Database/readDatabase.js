const poolDB = require('./databaseConn.js');


module.exports =
    async function read_database(tableName) {

        let clientConn;
        try {
            clientConn = await poolDB.connect();
            const results = await clientConn.query(`SELECT * from public."${tableName}";`)
            return results.rows;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            clientConn?.release();
        }
    };

