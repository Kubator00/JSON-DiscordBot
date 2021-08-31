module.exports.tenor_gif = tenor_gif;
module.exports.rand_gif_category = rand_gif_category;

const fetch = require('node-fetch');
const database = require("./database.js");


async function tenor_gif(keywords) {

  let url = `https://g.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_TOKEN}&ContentFilter=high`;
  let json;
  try {
    let response = await fetch(url);
    json = await response.json();
  }
  catch
  {
    return "Błąd połączenia";
  }
  const index = Math.floor(Math.random() * json.results.length);
  return json.results[index].url;

}


async function rand_gif_category() {
  let result = (await database.read_database("GIF_CATEGORY"));

  let rand = Math.floor(Math.random() * result.length);
  return result[rand]['value'];
}





