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

class PDFyPlugin {

    /**
     * @return {text, x, y, w, align, fontSize}[]
     */
    apply(doc, card, cardIndex, context = {}) {
        return this.doApply(doc, card, cardIndex, context);
    }

    doApply(doc, card, cardIndex, context = {}) {
        throw Error('TO BE OVERLOADED!!!');
    }

}

class PDFy {

    h;
    w;
    borders = [];
    options = {};
    pluginsBefore = [];
    pluginsAfter = [];

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

    registerPluginBefore(plugin) {
        this.pluginsBefore.push(plugin);

        return this;
    }

    registerPluginAfter(plugin) {
        this.pluginsAfter.push(plugin);

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

                const pluginContext = {
                    width: doc.page.width,
                    height: doc.page.height,
                }
                this.pluginsBefore.forEach(plugin => plugin.apply(doc, card, cardIndex, pluginContext));

                doc.rect(pX, pY, pW, pH).stroke();

                card.areas(context).forEach(area => {
                    if (area.fontSize) doc.fontSize(area.fontSize);
                    const x = pX + pW * area.x;
                    const y = pY + pH * area.y;
                    const width = pW * area.w;
                    const align = area.align;
                    // const h = area.h && (pH * area.h);
                    const options = {width, align};

                    const fillColor = area.fontColor || 'black';

                    doc
                        .fillColor(fillColor)
                        .font('Times-Roman')
                    // .font('Spartacus')
                    ;

                    if (area.text) {
                        doc.text(area.text, x, y, options);
                    } else if (area.advancedText) {
                        doc.text('', x, y, {...options, continued: true});
                        area.advancedText.forEach(token => {
                            if (token.highlight) {
                                const color = token.highlight === 2 ? 'blue' : (token.highlight === 3 ? 'red' : 'black')
                                doc
                                    .fillColor(color)
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

                this.pluginsAfter.forEach(plugin => plugin.apply(doc, card, cardIndex, pluginContext));

                if (cardIndex + 1 < cardArray.length) {
                    doc.addPage();
                }

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

class PDFyPluginPokerHandy extends PDFyPlugin {

    suitPicturesByIndex = {};
    suitColorsByIndex = {};

    constructor(options = {}) {
        super();

        this.suitPicturesByIndex = options.suitPicturesByIndex || {
            0: './resources/pictures/suits/handy/spade.png',
            1: './resources/pictures/suits/handy/diamond.png',
            2: './resources/pictures/suits/handy/heart.png',
            3: './resources/pictures/suits/handy/club.png',
        };
        this.suitColorsByIndex = options.suitPicturesByIndex || {
            0: 'black', // club
            1: 'red', // diamond
            2: 'red', // heart
            3: 'black', // spade
        };
        this.courtValues = options.courtValues;
        if (!this.courtValues) {
            if (options.language === 'fr') {
                this.courtValues = {
                    10: 'V',
                    11: 'D',
                    12: 'R',
                };
            } else {
                this.courtValues = {
                    10: 'J',
                    11: 'Q',
                    12: 'K',
                };
            }
        }
    }

    /**
     * @param i - 0-based
     */
    toValue(i) {
        if (i === 0) return 'A';
        if (i < 10) return '' + (i + 1);
        return this.courtValues[i] || ('' + i);
    };

    toSuit(i) {
        const picture = this.suitPicturesByIndex[i];
        if (!picture) throw new Error(`No Suit's picture defined for index=${i}`)
        const color = this.suitColorsByIndex[i];
        if (!color) throw new Error(`No Suit's color defined for index=${i}`)
        return {picture, color};
    }

    doApply(doc, card, cardIndex, context = {}) {
        if (cardIndex === 0) {
            doc.registerFont('JQKAs Wild Font', './resources/fonts/JqkasWild-w1YD6.ttf');
        }
        try {
            const size = 13;
            const no = this.toValue(cardIndex % size);
            const {picture, color} = this.toSuit(Math.trunc(cardIndex / size));

            const x = 67;
            const y = 75;

            const _w = doc.page.width;
            const _h = doc.page.height;

            // doc.rect(x, y, 120, 50).undash().lineWidth(10).stroke();

            doc
                .fillColor(color)
                .fontSize(130)
                .font('JQKAs Wild Font')
                .text(no, x - 10, y, {width: 120, align: 'center'})
                .image(picture, x + 5, y + 124, {width: 90})
            ;

            doc
                .save()
                .rotate(180, {origin: [_w / 2, _h / 2]})
                .text(no, x - 10, y, {width: 120, align: 'center'})
                .image(picture, x + 5, y + 124, {width: 90})
                .restore()
            ;
        } catch (e) {
            console.error('>> [ERROR] ', {cardIndex, card});
            throw e;
        }
    }

}


module.exports.PDFCard = PDFCard;
module.exports.PDFy = PDFy;
module.exports.PDFySizingMPCJumbo = PDFySizingMPCJumbo;
module.exports.PDFyPlugin = PDFyPlugin;
module.exports.PDFyPluginPokerHandy = PDFyPluginPokerHandy;
