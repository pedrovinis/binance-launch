
class Binance_Announcements {
    getImportantLast = async() => {
        const announcements = await this.getImportantLasts();
        return announcements[0];
    }
    
    getImportantLasts = async () => {
        const announcements = await this.#requestAnnouncements();
        const important = [];
        announcements.map( a => {
            if(this.#isAnnouncementImportant(a)) {
                const formatedAnnouncement = this.#formatImportantAnnouncement(a);
                important.push(formatedAnnouncement);
            };
        })
        return important;
    }
    
    #requestAnnouncements = async() => {
        const fetch = require('node-fetch');
        const res = await fetch("https://www.binance.com/bapi/composite/v1/public/cms/article/catalog/list/query?catalogId=48&pageNo=1&pageSize=15");
        const { data } = await res.json();
        return data.articles;
    }
    
    #isAnnouncementImportant = (announcement={}) => {
        const query = 'Binance Will List';
        if(announcement.title.search(query) >= 0) return true;
        else return false;
    }
    
    #formatImportantAnnouncement = (announcement={}) => {
        return {
            id: announcement.id,
            code: announcement.code,
            title: announcement.title,
            symbol: this.#getAnnouncementSymbol(announcement),
            url: `https://www.binance.com/en/support/announcement/${announcement.code}`
        };
    }
    
    #getAnnouncementSymbol = (announcement={}) => {
        const title = announcement.title;
        const start = title.search('[(]') + 1;
        const end = title.search('[)]');
        const symbol = title.slice(start, end);
        return symbol;
    }
}



module.exports = { Binance_Announcements };