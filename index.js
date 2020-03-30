const fs = require('fs');
const Cardify = require('./engine/cardify');
const pdf = require('./export/pdf-export');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile) throw new Error('Missing input file as first parameter');
if (!outputFile) throw new Error('Missing output file as second parameter');

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
    pdf.exportCardsAsPdf(cards, outputFile);
};

readFileAsLines(inputFile, undefined, linesHandler);