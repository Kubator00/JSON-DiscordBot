const getRandomInt = require('../Utilities/getRandomInt')
const loadJSON = require('../Utilities/loadJSON')


module.exports = (client) => {
  
  client.on("ready", () => {
    setStatus(client);  //ustawienie statusu po wlaczeniu bota
  })
 
  setInterval(() => {  
    setStatus(client); //co godzine zmienia status bota
  }, 3600000);

}

function setStatus(client) {
  const status = loadJSON(__dirname, 'status.json');
  const result = status[getRandomInt(0, status.length)];
  client.user.setActivity(result, { type: 'PLAYING' })
  console.log(`Status set '${result}'`);
}