const Collection = require('./Collection')
const {parse} = require('csv-parse/sync')

class Exchanges extends Collection {

    /**
     * @param data
     */
    constructor(data) {
        super();
        for (const row of parse(this.convertUtf8(data), {delimiter: ';'})) {
            this.data[row[0]] = {
                id: row[0],
                name: row[1]
            }
        }
    }
}
module.exports = Exchanges
