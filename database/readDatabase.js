const pg = require('pg');
const connect_database = require('./databaseConn.js');
const errorNotifications = require('../ErrorHandlers/errorHandlers.js').errorNotifications;
module.exports =
    async function read_database(tableName) {
        const database = connect_database();
        let result = [];
        return new Promise(function (resolve, reject) {
            const clientConn = new pg.Client(database);
            clientConn.connect(err => {
                if (err) return errorNotifications(`Blad polaczenia z baza ${err}`);
            });

            clientConn.query(`SELECT * from public."${tableName}";`, (err, res) => {
                if (err) {
                    errorNotifications(`Blad polaczenia z baza ${err}`);
                    clientConn.end();
                }
                else {
                    for (let row of res.rows) {
                        result.push(row);
                    }
                    clientConn.end();
                    resolve(result);
                }
            });

        })
    };

