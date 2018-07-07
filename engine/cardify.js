var Card = require('./card');

const bullets = ['/ ', '* ', '- '];

class Cardify {

    constructor() {
    }

    // set name(name) {
    //     this._name = name.charAt(0).toUpperCase() + name.slice(1);
    // }
    // get name() {
    //     return this._name;
    // }
    parseTitle(title) {
        if (bullets.indexOf(title.substr(0, 2)) >= 0) {
            return title.substr(2);
        }
        return title;
    }

    parse(lines) {
        let previous;
        return lines
            .filter(l => l && l.length > 0)
            .map(l => {
                const title = this.parseTitle(l);
                let epic;
                if (previous && title !== l) {
                    previous.remove = true;
                    epic = previous.title;
                }
                let card = new Card(title, epic);
                if (title === l) {
                    previous = card;
                }
                return card;
            })
            .filter(c => !c.remove)
            ;
    }
}

module.exports = Cardify;
