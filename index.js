const fs = require('fs');
const Cardify = require('./engine/cardify');
const pdf = require('./export/pdf-export');

const readFileAsLines = function(path, errorCB, successCB) {
    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            if (errorCB) { return errorCB(error); }
            throw err;
        }
        const lines = data.split(/\r?\n/);
        successCB(lines);
    });
};

const linesHandler = function(lines) {
    const cardify = new Cardify();
    const cards = cardify.parse(lines);
    pdf.exportCardsAsPdf(cards);
}

readFileAsLines('./notes.tmp.txt', undefined, linesHandler);