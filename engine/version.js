const fs = require('fs');
const moment = require('moment');

const defined = (v) => v || v === 0;

class Version {

    _major;
    _minor;
    _bugfix;
    _build;
    _date;
    _timestamp;
    _filename;

    filename(n = './version.json') {
        this._filename = n;
        return this;
    }

    major(v = 1) {
        this._major = v;
        return this;
    }

    minor(v = 0) {
        this._minor = v;
        return this;
    }

    bugfix(v = 1) {
        this._bugfix = v;
        return this;
    }

    build(v = 1) {
        this._build = v;
        return this;
    }

    date(v = 1) {
        this._date = v;
        return this;
    }

    timestamp(v = 1) {
        this._timestamp = v;
        return this;
    }

    bumpMajor() {
        this._major++;
        if (defined(this._minor)) this._minor = 0;
        if (defined(this._bugfix)) this._bugfix = 0;
        this.bumpDate();
        return this;
    }

    bumpMinor() {
        this._minor++;
        if (defined(this._bugfix)) this._bugfix = 0;
        this.bumpDate();
        return this;
    }

    bumpBugfix() {
        this._bugfix++;
        this.bumpDate();
        return this;
    }

    bumpBuild() {
        this._build++;
        this.bumpDate();
        return this;
    }

    bumpDate() {
        this._date = moment().format('YYYYMMDD');
        return this;
    }

    v() {
        return [this._major, this._minor, this._bugfix, this._build, this._date, this._timestamp]
            .filter(defined)
            .join('.')
        ;
    }

    load() {
        if (this._filename) {
            try {
                // console.log('>>>> this._filename=', this._filename)
                // const r = require(this._filename);
                const r = JSON.parse(fs.readFileSync(this._filename));

                this._major = r.major;
                this._minor = r.minor;
                this._bugfix = r.bugfix;
                this._build = r.build;
                this._date = r.date;
            } catch (e) {
                // console.error('>>>> ERROR=', e)
            }
        }
        return this;
    }

    save() {
        if (this._filename) {
            const v = {
                major: this._major,
                minor: this._minor,
                bugfix: this._bugfix,
                build: this._build,
                date: this._date,
                timestamp: new Date().toISOString(),
            };

            fs.writeFileSync(this._filename, JSON.stringify(v));
        }
        return this;
    }

}

module.exports.Version = Version;

// const v = new Version()
//     .major(0).minor(1).build(337).date()
//     .filename('./projects/iliade/version.json')
//     .load()
//     .bumpBuild()
//     .save()
//     .v();
// console.log('>>>>', {v})
