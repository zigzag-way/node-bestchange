const Currencies = require('./collections/Currencies')
const Rates = require('./collections/Rates')
const Exchanges = require('./collections/Exchanges')

const iconv = require('iconv-lite')
const unzipper = require('unzipper')
const {Readable} = require('stream')

class Index {

    constructor(apiUrl = 'http://api.bestchange.ru/info.zip') {
        this.apiUrl = apiUrl
    }

    /**
     * @returns {Promise<Index>}
     */
    async load() {
        const zip = await this.downloadZip()

        await zip
            .pipe(unzipper.Parse())
            .on('entry', async entry => {
                switch (entry.path) {
                    case 'bm_cy.dat':
                        this.currencies = new Currencies(this.unpack(await entry.buffer()))
                        break
                    case 'bm_exch.dat':
                        this.exchanges = new Exchanges(this.unpack(await entry.buffer()))
                        break
                    case 'bm_rates.dat':
                        this.rates = new Rates(this.unpack(await entry.buffer()))
                        break
                }
                entry.autodrain()
            }).promise()

        return this
    }

    /**
     * @returns {Promise<Readable>}
     */
    async downloadZip() {
        const res = await fetch(this.apiUrl)

        return Readable.fromWeb(res.body)
    }

    /**
     * @returns {Rates}
     */
    getRates() {
        return this.rates
    }

    /**
     * @returns {Exchanges}
     */
    getExchanges () {
        return this.exchanges
    }

    /**
     * @returns {Currencies}
     */
    getCurrencies () {
        return this.currencies
    }

    /**
     * @param data
     * @returns {string}
     */
    unpack(data) {
        return iconv.encode(iconv.decode(data, 'windows-1251'), 'utf8').toString()
    }
}

module.exports = Index
