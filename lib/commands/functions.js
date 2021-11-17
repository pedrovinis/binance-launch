const readlineSync = require('readline-sync');
const { GateClient } = require("../gate/api");
const { getLastAnnouncement, getLastAnnoucements } = require("../binance/announcements");

const GATE_CLIENT = new GateClient();
const NOT_AUTHENTICATED_MESSAGE = 'Not Authenticated. Type "-auth" to authenticate.'

const help = (COMMANDS) => {
    console.log('\n');
    COMMANDS.map( c => {
        console.log(`${c.query} > ${c.description}`);
    })
    console.log('\n');
}

const BinanceMonitor = async() => {
    console.log('Monitoring...');
    const last = await getLastAnnouncement();
    let cont = 1;
    while(true) {
        const New = await getLastAnnouncement();
        console.log(`Last symbol found: "${New.symbol}". Request Number: ${cont}`);
        if(New.symbol != last.symbol) {
            console.log(`\nFound: ${new Date()}`);
            console.log(New);
            return;
        }
        cont ++;
        await new Promise(r => setTimeout(r, 2000));
    }
}

const BinanceLast = async() => {
    const lasts = await getLastAnnoucements();
    lasts.reverse().map( a => {
        console.log(`${a.title}\n Symbol: ${a.symbol}\n ${a.url}\n https://www.gate.io/trade/${a.symbol}_USDT`);
        console.log('\n');
    });
}

const GateAuth = async() => {
    const key = readlineSync.question('Key: ', {
        hideEchoBack: true,
    });
    const secret = readlineSync.question('Secret: ', {
        hideEchoBack: true,
    });

    GATE_CLIENT.setApiKeySecret(key, secret);
    await GATE_CLIENT.authenticate();

    if(GATE_CLIENT.authenticated) {
        console.log('Authentication successful.');
        return;
    }
    
    console.log('Authentication failed, try again.');
}

const GateBalance = async() => {
    if(GATE_CLIENT.authenticated) {
        const data = await GATE_CLIENT.getBalance();
        console.log(`Total: $${data.total.amount}`);
        return;
    }
    console.log(NOT_AUTHENTICATED_MESSAGE);
}

const GateBuy = async() => {
    if(GATE_CLIENT.authenticated) {
        const currencyPair = readlineSync.question('Currency Pair: ');
        const price = readlineSync.question('Price: ');
        const amount = readlineSync.question('Amount: ');

        try {
            const data = await GATE_CLIENT.createOrder(currencyPair, 'buy', price, amount);
            console.log(`Order successful created - Order id: ${data.id}`);
        }
        catch {
            console.log('Error on create order.');
        }
        return;
    }
    console.log(NOT_AUTHENTICATED_MESSAGE);
}

module.exports = { 
    help,
    BinanceMonitor,
    BinanceLast,
    GateAuth,
    GateBalance,
    GateBuy
}