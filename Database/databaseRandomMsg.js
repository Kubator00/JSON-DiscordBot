import {readFromDatabase} from "./readDatabase.js";
export default  async function randomMessageFromDatabase(table_name) {
    let result = await readFromDatabase(table_name);
    if(!result || result.length<1)
      return false;
    let rand = Math.floor(Math.random() * result.length);
    return result[rand]['value'];
  }


