var expect = require('chai').expect;
var Cardify = require('./cardify');

const lines = [
    'AGILE TRANSFO',
    '',
    'Rétrospective',
    '/ Avancement de chacun => standup, chaque jour',
    '* Amélioration du produit => planning game, chaque sprint',
    '- Amélioration du fonctionnement => rétro, chaque sprint',
    '- VALEURS (pour garder le cap)'
];

describe('parse()', function () {

    it('should parse sub card title', function () {
        const cardify = new Cardify();
        expect(cardify.parseTitle(lines[2])).to.be.equal(lines[2]);
        expect(cardify.parseTitle(lines[3])).to.be.equal('Avancement de chacun => standup, chaque jour');
        expect(cardify.parseTitle(lines[4])).to.be.equal('Amélioration du produit => planning game, chaque sprint');
        expect(cardify.parseTitle(lines[5])).to.be.equal('Amélioration du fonctionnement => rétro, chaque sprint');
        expect(cardify.parseTitle(lines[6])).to.be.equal('VALEURS (pour garder le cap)');
    });

    it('should return cards with epic for sub cards', function () {
        const cardify = new Cardify();
        const cards = cardify.parse(lines);

        expect(cards).to.have.lengthOf(5);

        expect(cards[0].title).to.be.equal(lines[0]);
        expect(cards[0].epic).to.be.equal(undefined);

        expect(cards[1].title).to.be.equal('Avancement de chacun => standup, chaque jour');
        expect(cards[1].epic).to.be.equal(lines[2]);

        expect(cards[2].title).to.be.equal('Amélioration du produit => planning game, chaque sprint');
        expect(cards[2].epic).to.be.equal(lines[2]);

        expect(cards[3].title).to.be.equal('Amélioration du fonctionnement => rétro, chaque sprint');
        expect(cards[3].epic).to.be.equal(lines[2]);

        expect(cards[4].title).to.be.equal('VALEURS (pour garder le cap)');
        expect(cards[4].epic).to.be.equal(lines[2]);
    });

});
