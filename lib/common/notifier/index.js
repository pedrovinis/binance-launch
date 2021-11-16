const notifier = require('node-notifier');
const path = require('path');

const notify = (message) => {
    notifier.notify({
        title: 'Money Rain',
        icon: path.join(__dirname, 'icon.png'),
        message: `${message}`,
    });
}

module.exports = { notify };