const PDFDocument = require('pdfkit');
// const markdown = require('markdown').markdown;
const fs = require('fs');

class PDFCard {

    constructor() {
    }

    /**
     * @return {text, x, y, w, align, fontSize}[]
     */
    areas(context) {
        return this.doAreas(context);
    }

    doAreas(context) {
        throw Error('TO BE OVERLOADED!!!');
    }

}

class PDFy {

    h;
    w;
    borders = [];
    options = {};

    constructor(options = {
        // cardWidth: 55,
        // cardHeight: 22,
        titleFont: 9,
        subtitleFont: 8,
        descriptionFont: 8,
        withNumber: true,
    }) {
        this.options = options;
    }

    sizing(sizing, hideBlueprint) {
        sizing.apply(this, hideBlueprint);
        return this;
    }

    dimensions(h, w) {
        this.h = h;
        this.w = w;

        return this;
    }

    border(h, w) {
        this.borders.push({h, w});

        return this;
    }

    export(cards, filePath, context) {

        // Create a document
        const options = {};
        if (this.h && this.w) {
            options.size = [this.w, this.h];
            options.margins = { // by default, all are 72
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        }
        const doc = new PDFDocument(options);

        // https://pdfkit.org/docs/text.html#fonts
        // doc.registerFont('Spartacus', './projects/iliade/fonts/spartacus-font/Spartacus-KVdLp.ttf');

        // Pipe its output somewhere, like to a file or HTTP response
        // See below for browser usage
        doc.pipe(fs.createWriteStream(filePath));

        const pX = 0; // 50; // Horizontal padding for the whole page
        const pY = 0; // 40; // Vertical padding for the whole page

        const _w = doc.page.width - 2 * pX;
        const _h = doc.page.height - 2 * pY;

        var pW = _w;
        var pH = _h;
        if (this.w && this.h) {
            if (_w / _h < this.w / this.h) {
                pW = _h * this.w / this.h;
            } else {
                pH = _w * this.h / this.w;
            }
        }

        cards
            // .filter(c => c.done !== true)
            .forEach((card, cardIndex, cardArray) => {
                // doc.page.margins = {
                //     top: 0,
                //     bottom: 0,
                //     left: 0,
                //     right: 0,
                // };

                doc.rect(pX, pY, pW, pH).stroke();

                // let epic = card.epic;
                // epic = epic ? `(${epic.substr(0, 40) + (epic.length > 40 ? '...' : '')})` : ' ';
                // doc.fontSize(subtitleFont);
                // doc.text(epic, pX + x * w + cX / 2, pY + y * h + cY, {width: (w - cX), align: 'center', lineGap: 10});
                //
                // // doc.fontSize(card.title.length < 85 ? titleFont : 10);
                // doc.fontSize(titleFont);
                // doc.text(card.title, {width: (w - 2 * cX), align: 'left'});

                card.areas(context).forEach(area => {
                    if (area.fontSize) doc.fontSize(area.fontSize);
                    const x = pX + pW * area.x;
                    const y = pY + pH * area.y;
                    const width = pW * area.w;
                    const align = area.align;
                    // const h = area.h && (pH * area.h);
                    const options = {width, align};

                    doc
                        .fillColor('black')
                        .font('Times-Roman')
                    // .font('Spartacus')
                    ;

                    if (area.text) {
                        doc.text(area.text, x, y, options);
                    } else if (area.advancedText) {
                        doc.text('', x, y, {...options, continued: true});
                        area.advancedText.forEach(token => {
                            if (token.highlight) {
                                doc
                                    .fillColor('red')
                                    .font('Times-Bold')
                                ;
                            } else {
                                doc
                                    .fillColor('black')
                                    .font('Times-Roman')
                                ;
                            }
                            const text = `${token.text}`;
                            doc.text(text, {...options, continued: true});
                        });
                        doc
                            .fillColor('black')
                            .font('Times-Roman')
                            .text('');
                    } else if (area.picture) {
                        doc.image(area.picture, x, y, options);
                    }
                });

                this.borders.forEach(b => {
                    const __w = b.w * pW / (this.w || _w);
                    const __h = b.h * pH / (this.h || _h);
                    const __x = pX + (pW - __w) / 2;
                    const __y = pY + (pH - __h) / 2;
                    doc
                        .rect(__x, __y, __w, __h)
                        .dash(5, {space: 5})
                        .stroke()
                    ;
                })

                if (cardIndex + 1 < cardArray.length) {
                    doc.addPage();
                }

                // if (card.description) {
                //     doc.fontSize(descriptionFont);
                //     doc.text(' ');
                //     card.description.forEach(d => {
                //         doc.text(d, {width: (w - 2 * cX), align: 'left'});
                //     });
                // }

                // if (options.withNumber) {
                //     doc.fontSize(subtitleFont);
                //     doc.text(i, pX + x * w + cX / 2, pY + (y + 1) * h - cY, {
                //         width: (w - cX),
                //         align: 'right',
                //         lineGap: 10
                //     });
                // }

            });

        //
        // Finish last page with empty cells and add 1 page with empty cells (to manually create cards)
        //
        // let pageFinished = 0;
        // while (pageFinished < 2) {
        //     doc.rect(pX + x * w, pY + y * h, w, h).stroke();
        //     x++;
        //     if ((x + 1) * w > pW) {
        //         x = 0;
        //         y++;
        //     }
        //     if ((y + 1) * h > pH) {
        //         ++pageFinished;
        //         if (pageFinished < 2) {
        //             y = 0;
        //             doc.addPage();
        //         }
        //     }
        // }

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

}

class PDFySizing {

    _hideBlueprint;

    hideBlueprint(hideBlueprint) {
        this._hideBlueprint = hideBlueprint;
        return this;
    }

    bleeding(pdfy, h, w) {
        pdfy.dimensions(h, w);
        return this;
    }

    cut(pdfy, h, w) {
        if (!this._hideBlueprint) {
            pdfy.border(h, w);
        }
        return this;
    }

    safe(pdfy, h, w) {
        if (!this._hideBlueprint) {
            pdfy.border(h, w);
        }
        return this;
    }
}

class PDFySizingMPCJumbo extends PDFySizing {
    apply(pdfy, hideBlueprint) {
        this
            .hideBlueprint(hideBlueprint)
            .bleeding(pdfy,1570, 1120)
            .cut(pdfy,1500, 1050)
            // .safe(pdfy,1425, 975)
        ;
    }
}

module.exports.PDFCard = PDFCard;
module.exports.PDFy = PDFy;
module.exports.PDFySizingMPCJumbo = PDFySizingMPCJumbo;
