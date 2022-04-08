import getRandomInt from "../Utilities/getRandomInt.js";
import loadJSON from "../Utilities/loadJSON.js";
import {dirname} from 'path';
import { fileURLToPath } from 'url';

export default (client) => {
  
  client.on("ready", () => {
    setStatus(client);  //ustawienie statusu po wlaczeniu bota
  })
 
  setInterval(() => {  
    setStatus(client); //co godzine zmienia status bota
  }, 3600000);

}

function setStatus(client) {
  const status = loadJSON( dirname(fileURLToPath(import.meta.url)), 'status.json');
  const result = status[getRandomInt(0, status.length)];
  client.user.setActivity(result, { type: 'PLAYING' })
  console.log(`Status set '${result}'`);
}