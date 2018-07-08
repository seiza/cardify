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
        if (!title || !title.trim()) {
            return undefined;
        }
        if (bullets.indexOf(title.substr(0, 2)) >= 0) {
            title = title.substr(2);
            if (actions.indexOf(title.substr(0, 4)) >= 0) {
                title = title.substr(4);
            }
        }
        title = title.split('|')[0].trim();
        return title;
    }

    parseDone(title) {
        const status = title.substr(0, 6);
        if (status == '- [ ] ') { return false; }
        if (status == '- [x] ') { return true; }
        return undefined;
    }

    parseDescription(title) {
        let tail = title.split('|');
        tail.splice(0, 1);
        return tail.map(t => t.trim());
    }

    parse(lines) {
        let previous;
        return lines
            .map(l => {
                const title = this.parseTitle(l);
                if (!title) {
                    previous = undefined;
                    return undefined;
                }
                let epic;
                if (previous && title !== l) {
                    previous.remove = true;
                    epic = previous.title;
                }
                let card = new Card(title, epic);
                let d = this.parseDescription(l);
                if (d) {
                    card.description = d;
                }
                card.done = this.parseDone(l);
                if (title === l) {
                    previous = card;
                }
                return card;
            })
            .filter(c => c && c.title && !c.remove)
            ;
    }
}

module.exports = Cardify;
