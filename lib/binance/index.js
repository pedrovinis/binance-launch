const { Binance_Announcements } = require("./announcements");

class Binance {
    constructor() {
        this.announcements = new Binance_Announcements();
    }
}

module.exports = { Binance };