const pg = require('pg');


module.exports.rand_message = rand_message;
module.exports.read_database = read_database;

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;



async function rand_message(table_name) {
  let result = (await read_database(table_name));
  // console.log(result);
  let rand = Math.floor(Math.random() * result.length);
  return result[rand]['value'];

}






async function read_database(tableName) {

  const database = {
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  };



  let result = [];
  return new Promise(function (resolve, reject) {
    const clientConn = new pg.Client(database);
    clientConn.connect(err => {
      if (err) return console.log(`BLAD POLACZENIA Z BAZA ${err}`);
    });



    clientConn.query(`SELECT * from public."${tableName}";`, (err, res) => {
      if (err) {
        console.log(`BLAD ZAPYTANIA DO BAZY ${err}`);
        clientConn.end();
      }
      else {
        for (let row of res.rows) {
          result.push(row);
        }
        clientConn.end();
        console.log("POLACZENIE ZAKONCZONE 1")
        resolve(result);
      }
      // try {
      //   clientConn.end();
      //   console.log("POLACZENIE ZAKONCZONE 2")
      // }
      // catch {
      //   console.log("POLACZENIE JUZ WCZESNIEJ ZAKONCZONE 2")
      // }

    });

  })
};

