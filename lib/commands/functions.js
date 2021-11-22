const readlineSync = require('readline-sync');
const { Gate } = require("../gate");
const { Binance } = require("../binance");

const BINANCE_CLIENT = new Binance();
const GATE_CLIENT = new Gate();
const NOT_AUTHENTICATED_MESSAGE = 'Not Authenticated. Type "-auth" to authenticate.'

const help = (COMMANDS) => {
    console.log('\n');
    COMMANDS.map( c => {
        console.log(`${c.query} > ${c.description}`);
    })
    console.log('\n');
}

const BinanceMonitor = async() => {
    if(GATE_CLIENT.authenticated) {
        const announcements = BINANCE_CLIENT.announcements
        const last = await announcements.getImportantLast();

        let cont = 1;
        while(true) {
            const New = await announcements.getImportantLast();
            console.log(`Last symbol found: "${New.symbol}". Request Number: ${cont}. At: ${new Date()}`);
            if(New.symbol != last.symbol) {
                console.log(New);
                try {
                    const currencyPairInfo = await GATE_CLIENT.listTickers(`${New.symbol}_USDT`);
                    console.log(currencyPairInfo[0]);
                }
                catch {
                    console.log('Error on get symbol info on Gate.io.')
                }
                return;
            }
            cont ++;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    console.log(NOT_AUTHENTICATED_MESSAGE);
}

const BinanceLast = async() => {
    const lasts = await BINANCE_CLIENT.announcements.getImportantLasts();
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

const GateList = async() => {
    if(GATE_CLIENT.authenticated) {
        const currencyPair = readlineSync.question('Currency Pair: ');
        try {
            const data = await GATE_CLIENT.listTickers(currencyPair);
            console.log(data[0]);
        }
        catch {
            console.log('Error on get Pair info.');
        }
        return;
    }
    console.log(NOT_AUTHENTICATED_MESSAGE);
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
    GateList,
    GateBalance,
    GateBuy
}