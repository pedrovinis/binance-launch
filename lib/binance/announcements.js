const fetch = require('node-fetch');

const getLastAnnoucements = async () => {
    const query_tag_start = `href="/en/support/announcement/`;
    const query_end_tag = '</a>';
    const max_annnounces = 15;

    const data = await getAnnouncementsPageData();

    const announcements = [];
    let lastTagEndQuery = 0;

    for(let i=0; i<max_annnounces; i++) {
        const slicedData = data.slice(lastTagEndQuery, data.length)
        const sStart = slicedData.search(query_tag_start);

        const sSliced = slicedData.slice(sStart, data.length);
        const sEnd = sSliced.search(query_end_tag);
    
        lastTagEndQuery += sStart + query_tag_start.length 
        const announcement = sSliced.slice(0, sEnd);
        
        const important = isAnnouncementImportant(announcement);
        if(important) {
            announcements.push({
                title: getAnnouncementTitle(announcement),
                symbol: getAnnouncemenSymbol(announcement),
                url: `https://www.binance.com${getAnnouncementUrl(announcement)}`
            })
        }
    }

    return announcements;
}

const getLastAnnouncement = async() => {
    const announcements = await getLastAnnoucements();
    return announcements[0];
}

const getAnnouncementsPageData = async() => {
    const res = await fetch('https://www.binance.com/en/support/announcement/c-48?navId=48');
    const data = await res.text();
    return data;
}

const isAnnouncementImportant = (announcement='') => {
    const query = 'Binance Will List';
    if(announcement.search(query) >= 0) return true;
    else return false;
}

const getAnnouncementTitle = (announcement='') => {
    const query = '">';
    const start = announcement.search(query) + query.length;
    const data = announcement.slice(start, announcement.length);

    return data;
}

const getAnnouncemenSymbol = (announcement='') => {
    const title = getAnnouncementTitle(announcement);
    const start = title.search('[(]') + 1;
    const sliced = title.slice(start, title.length);
    const end = sliced.search('[)]');
    const data = sliced.slice(0, end);

    return data;
}

const getAnnouncementUrl = (announcement='') => {
    const query = 'href="';
    const start = announcement.search(query) + query.length;
    const sliced = announcement.slice(start, announcement.length);
    const end = sliced.search('"');
    const data = sliced.slice(0, end);

    return data;
}


module.exports = {
    getLastAnnoucements,
    getLastAnnouncement
}