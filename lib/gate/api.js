const GateApi = require('gate-api');

class Gate {
    constructor(key='key', secret='secret') {
        const client = new GateApi.ApiClient();
        client.setApiKeySecret(key, secret);

        this.api = new GateApi.WalletApi(client);
        this.cfg = {
            currency: 'USD'
        };
    }

    getBalance = async() => {
        const data = await this.api.getTotalBalance(this.cfg);
        return data.body;
    }

}


module.exports = { Gate };