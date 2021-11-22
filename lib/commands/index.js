const { help, BinanceMonitor, BinanceLast, GateAuth, GateBalance, GateBuy, GateList } = require("./functions");

const COMMANDS = [
    {
        query: '-help',
        description: 'Show all Commands.',
        function: async() => { help(COMMANDS); }
    },
    {
        query: '-monitor',
        description: 'Start binance monitor.',
        function: async() => { await BinanceMonitor(); }
    },
    {
        query: '-last',
        description: 'Show last important Binance announces info.',
        function: async() => { await BinanceLast(); }
    },
    {
        query: '-auth',
        description: 'Authenticate your Gate.io Account.',
        function: async() => { await GateAuth(); }
    },
    {
        query: '-list',
        description: 'Check a Currency Pair info.',
        function: async() => { await GateList(); }
    },
    {
        query: '-balance',
        description: 'Check your Gate.io Balance.',
        function: async() => { await GateBalance(); }
    },
    {
        query: '-buy',
        description: 'Create a Gate.io Buy Order.',
        function: async() => { await GateBuy(); }
    }
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