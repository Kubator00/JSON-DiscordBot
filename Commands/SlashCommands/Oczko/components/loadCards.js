const fs = require('fs');
const pathR = require('path');


module.exports = () => {
    const path = pathR.join(__dirname, 'cards.json');
    let cards = fs.readFileSync(path,
        { encoding: 'utf8', flag: 'r' });
    cards = JSON.parse(cards);
    cards = cards.data;
    return cards;
}


