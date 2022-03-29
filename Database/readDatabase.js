const pg = require('pg');
const connect_database = require('./databaseConn.js');

module.exports =
    async function read_database(tableName) {
        const database = connect_database();
        const clientConn = new pg.Client(database);
        let result = [];
        try {
            await clientConn.connect();
            await clientConn.query(`SELECT * from public."${tableName}";`)
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
        return result;
    };

