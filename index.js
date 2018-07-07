const fs = require('fs');

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
    lines.forEach(l => console.log('> ', l));
}

readFileAsLines('./notes.tmp.txt', undefined, linesHandler);