var Card = require('./card');

const bullets = ['/ ', '* ', '- '];
const actions = ['[ ] ', '[x] '];

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
            title = title.substr(2);
            if (actions.indexOf(title.substr(0, 4)) >= 0) {
                title = title.substr(4);
            }
        }
        return title;
    }

    parseDone(title) {
        const status = title.substr(0, 6);
        if (status == '- [ ] ') { return false; }
        if (status == '- [x] ') { return true; }
        return undefined;
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
                card.done = this.parseDone(l);
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
