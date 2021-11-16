const { getLastAnnouncement } = require("../binance/announcements");

const runMonitor = async() => {
    const last = await getLastAnnouncement();

    while(true) {
        const New = await getLastAnnouncement();
        if(New.symbol != last.symbol) {
            return req_last
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

module.exports = { runMonitor }