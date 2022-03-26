const fs = require('fs');
const pathR = require('path');


module.exports = (dirname,filename) => {
    const path = pathR.join(dirname, filename);
    let cards = fs.readFileSync(path,
        { encoding: 'utf8', flag: 'r' });
    cards = JSON.parse(cards);
    cards = cards.data;
    return cards;
}


