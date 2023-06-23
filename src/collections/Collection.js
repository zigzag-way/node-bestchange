const iconv = require("iconv-lite");

/**
 * Abstract class Collection
 */
class Collection {
    constructor () {
        this.data = []
    }

    /**
     * @param id
     * @returns {boolean}
     */
    get (id) {
        return this.data[id] ? this.data[id] : false
    }

    /**
     * @returns {Array}
     */
    getData () {
        return this.data
    }

    multiFieldSort(sortParams) {
        return this.data.sort((a, b) => {
            for (let i = 0; i < sortParams.length; i++) {
                const { field, order } = sortParams[i];
                const aValue = a[field];
                const bValue = b[field];

                if (aValue < bValue) {
                    return order === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return order === 'asc' ? 1 : -1;
                }
            }

            return 0; // Objects are equal for all specified fields
        });
    }

    /**
     * @param buf
     * @returns {Buffer}
     */
    convertUtf8(buf) {
        return iconv.encode(iconv.decode(buf, 'windows-1251'), 'utf8')
    }
}

module.exports = Collection
