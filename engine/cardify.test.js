var expect = require('chai').expect;
var Cardify = require('./cardify');

const lines = [
    'AGILE TRANSFO',
    '',
    'Rétrospective',
    '/ Avancement de chacun => standup, chaque jour    ',
    '* Amélioration du produit => planning game, chaque sprint',
    '- Amélioration du fonctionnement => rétro, chaque sprint',
    '- VALEURS (pour garder le cap)',
    '  ',
    '- [ ] Créativité',
    '- [x] Collaboration / co-construction',
    '- 254) 1/ Responsabilisé | lâché prise  | => Impliquer | le plus dur',
];

describe('parse()', function () {

    it('should parse blank titles', function () {
        const cardify = new Cardify();
        expect(cardify.parseTitle(undefined)).to.be.equal(undefined);
        expect(cardify.parseTitle('')).to.be.equal(undefined);
        expect(cardify.parseTitle(' ')).to.be.equal(undefined);
    });

    it('should parse sub card title', function () {
        const cardify = new Cardify();
        expect(cardify.parseTitle(lines[2])).to.be.equal(lines[2]);
        expect(cardify.parseTitle(lines[3])).to.be.equal('Avancement de chacun => standup, chaque jour');
        expect(cardify.parseTitle(lines[4])).to.be.equal('Amélioration du produit => planning game, chaque sprint');
        expect(cardify.parseTitle(lines[5])).to.be.equal('Amélioration du fonctionnement => rétro, chaque sprint');
        expect(cardify.parseTitle(lines[6])).to.be.equal('VALEURS (pour garder le cap)');
    });

    it('should parse action titles', function () {
        const cardify = new Cardify();
        expect(cardify.parseTitle(lines[8])).to.be.equal('Créativité');
        expect(cardify.parseTitle(lines[9])).to.be.equal('Collaboration / co-construction');
    });

    it('should parse detailed titles', function () {
        const cardify = new Cardify();
        expect(cardify.parseTitle(lines[10])).to.be.equal('254) 1/ Responsabilisé');
    });

    it('should parse description from titles', function () {
        const cardify = new Cardify();
        expect(cardify.parseDescription(lines[9])).to.have.members([]);
        expect(cardify.parseDescription(lines[10])).to.have.members(['lâché prise', '=> Impliquer', 'le plus dur']);
    });

    it('should parse DONE status from title', function () {
        const cardify = new Cardify();
        expect(cardify.parseDone(lines[7])).to.be.equal(undefined);
        expect(cardify.parseDone(lines[8])).to.be.false;
        expect(cardify.parseDone(lines[9])).to.be.true;
    });

    it('should return cards with epic for sub cards', function () {
        const cardify = new Cardify();
        const cards = cardify.parse(lines);

        expect(cards).to.have.lengthOf(8);

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
        expect(cards[4].done).to.be.equal(undefined);

        expect(cards[5].title).to.be.equal('Créativité');
        expect(cards[5].epic).to.be.equal(undefined);
        expect(cards[5].done).to.be.false;

        expect(cards[6].title).to.be.equal('Collaboration / co-construction');
        expect(cards[6].epic).to.be.equal(undefined);
        expect(cards[6].done).to.be.true;

        expect(cards[7].title).to.be.equal('254) 1/ Responsabilisé');
        expect(cards[7].epic).to.be.equal(undefined);
        expect(cards[7].done).to.be.equal(undefined);
        expect(cards[7].description).to.have.members(['lâché prise', '=> Impliquer', 'le plus dur']);
    });

});
