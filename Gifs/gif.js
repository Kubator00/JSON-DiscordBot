import randomMessageFromDatabase from '../Database/databaseRandomMsg.js'
import fetch from 'node-fetch';


export async function getGif(keywords) {
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


export async function randomGifCategory() {
  return (await randomMessageFromDatabase("GIF_CATEGORY"));
}





