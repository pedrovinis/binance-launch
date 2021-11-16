const { runMonitor } = require("../binance/ monitor");
const { getLastAnnoucements } = require("../binance/announcements");

const COMMANDS = [
    {
        query: '-help',
        description: 'Show all Commands.',
        function: async() => {
            console.log('\n');
            COMMANDS.map( c => {
                console.log(`${c.query} > ${c.description}`);
            })
            console.log('\n');
        }
    },
    {
        query: '-monitor',
        description: 'Start binance monitor.',
        function: async() => { await runMonitor(); }
    },
    {
        query: '-last',
        description: 'Show last important Binance announces info.',
        function: async() => { 
            const lasts = await getLastAnnoucements();
            lasts.map( a => {
                console.log(`${a.title}\n Symbol: ${a.symbol}\n ${a.url}\n https://www.gate.io/trade/${a.symbol}_USDT`);
                console.log('\n')
            });
        }
    },
]

const runCommand = async(_command='') => {
    const command = COMMANDS.find( c => c.query == _command);
    if(!command) {
        console.log('Command not Found, type "-help" to see all commands.');
        return
    }
    await command.function();
}

module.exports = {
    COMMANDS,
    runCommand
}