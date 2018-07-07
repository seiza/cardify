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

    it('should filter blank lines', function () {
        const cardify = new Cardify();
        const cards = cardify.parse(lines);
        expect(cards).to.have.lengthOf(5);
    });

    it('should return cards with title for single lines', function () {
        const cardify = new Cardify();
        const cards = cardify.parse(lines);
        expect(cards[0].title).to.be.equal(lines[0]);
        expect(cards[1].title).to.be.equal(lines[2]);
        expect(cards[2].title).to.be.equal(lines[3]);
    });

});
