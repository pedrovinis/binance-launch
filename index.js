const package = require('./package.json')
const readlineSync = require('readline-sync');
const { runCommand } = require('./lib/commands');

const main = async() => {
    console.log(`Money Rain - v${package.version}\n`);
    console.log('Type "-help" to see all commands.\n')
    while(true) {
        const command = readlineSync.question('$- ');
        await runCommand(command);
    }
}

main();