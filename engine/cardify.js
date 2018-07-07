var Card = require('./card');

class Cardify {

    constructor() {}
    // set name(name) {
    //     this._name = name.charAt(0).toUpperCase() + name.slice(1);
    // }
    // get name() {
    //     return this._name;
    // }
    parse(lines) {
        return lines.filter(l => l && l.length > 0).map(l => new Card(l));
    }
}
module.exports = Cardify;
