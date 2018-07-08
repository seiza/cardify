const PDFDocument = require('pdfkit');
const fs = require('fs');
// const card = require('../engine/card');

module.exports.exportCardsAsPdf = function (cards) {

    // Create a document
    doc = new PDFDocument;

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream('output.tmp.pdf'));

    const pX = 50;
    const pY = 50;
    const cX = 10;
    const cY = 10;

    const pW = doc.page.width - 2*pX;
    const pH = doc.page.height - 2*pY;

    let x = 0;
    let y = 0;

    const wmm = 74; /*mm*/
    const hmm = 53; /*mm*/
    const w = Math.round(wmm * 200 / 66 /*mm*/);
    const h = Math.round(hmm * 100 / 33 /*mm*/);

    const titleFont = 15;
    const subtitleFont = 10;
    const descriptionFont = 12;

    cards
    .filter(c => c.done !== true)
    .forEach(card => {
        doc.rect(pX + x*w, pY + y*h, w, h).stroke();

        let epic = card.epic;
        epic = epic ? `(${epic.substr(0,40) + ( epic.length > 40 ? '...' : '')})` : ' ';
        doc.fontSize(subtitleFont);
        doc.text(epic, pX + x*w + cX, pY + y*h + cY, {width: (w - 2*cX), align: 'center', lineGap:10});

        doc.fontSize(card.title.length < 85 ? titleFont : 12);
        doc.text(card.title, {width: (w - 2*cX), align: 'left'});

        if (card.description) {
            doc.fontSize(descriptionFont);
            doc.text(' ');
            card.description.forEach(d => {
                doc.text(d, {width: (w - 2*cX), align: 'left'});
            });
        }

        x++;
        if ((x+1) * w > pW) {
            x = 0;
            y++;
        }
        if ((y+1) * h > pH) {
            y = 0;
            doc.addPage();
        }

    });

    // // Embed a font, set the font size, and render some text
    // doc/*.font('fonts/PalatinoBold.ttf')*/
    //     .fontSize(25)
    //     .text('Some text with an embedded font!', 100, 100);
    //
    // // Add another page
    // doc.addPage()
    //     .fontSize(25)
    //     .text('Here is some vector graphics...', 100, 100);
    //
    // // Draw a triangle
    // doc.save()
    //     .moveTo(100, 150)
    //     .lineTo(100, 250)
    //     .lineTo(200, 250)
    //     .fill("#FF3300");
    //
    // // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    // doc.scale(0.6)
    //     .translate(470, -380)
    //     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    //     .fill('red', 'even-odd')
    //     .restore();
    //
    // // Add some text with annotations
    // doc.addPage()
    //     .fillColor("blue")
    //     .text('Here is a link!', 100, 100)
    //     .underline(100, 100, 160, 27, "#0000FF")
    //     .link(100, 100, 160, 27, 'http://google.com/');

    // Finalize PDF file
    doc.end();
}