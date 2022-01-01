const pg = require('pg');
const connect_database = require('../../../../Database/databaseConn.js');
module.exports.read_lol_quotes_stats = read_lol_quotes_stats;   
async function read_lol_quotes_stats(guildId) {
    const database = connect_database();
    return new Promise(function (resolve, reject) {
        const clientConn = new pg.Client(database);
        clientConn.connect(err => {
            if (err) return errorNotifications(`Blad polaczenia z baza ${err}`);
        });
        clientConn.query(`SELECT id_discord, correct_answers, wrong_answers  from public."LOL_QUOTES_STATS" where id_guild='${guildId}' ORDER BY correct_answers DESC LIMIT 15;`, (err, res) => {
            if (err) {
                console.log(err);
                clientConn.end();
            }
            else {
                clientConn.end();
                resolve(res.rows);
            }
        });
    });
}