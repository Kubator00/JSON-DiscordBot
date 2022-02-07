const read_database = require('./readDatabase.js');
module.exports =
  async function rand_message(table_name) {
    let result = await read_database(table_name);
    if(!result || result.length<1)
      return false;
    let rand = Math.floor(Math.random() * result.length);
    return result[rand]['value'];
  }


