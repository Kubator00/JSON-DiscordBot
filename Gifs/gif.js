const randDatabase = require('../Database/databaseRandomMsg');
const fetch = require('node-fetch');

module.exports = { tenor_gif, rand_gif_category }


async function tenor_gif(keywords) {
  let url = `https://g.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_TOKEN}&ContentFilter=high`;
  let json, i;
  try {
    let response = await fetch(url);
    json = await response.json();
    i = Math.floor(Math.random() * json.results.length);
    return json.results[i].url;
  }
  catch (err) {
    console.log(`Błąd łączenia z tenor, ${err}`);
    return `Błąd łączenia z serwerem`;
  }
}


async function rand_gif_category() {
  return (await randDatabase("GIF_CATEGORY"));
}





