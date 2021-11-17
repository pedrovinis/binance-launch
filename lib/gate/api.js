const { Order } = require('gate-api');
const GateApi = require('gate-api');

class GateClient {
    constructor() {
        this.client = new GateApi.ApiClient();
        this.authenticated = false;

        this.cfg = {
            currency: 'USD'
        };
    }

    setApiKeySecret(key='', secret='') {
        this.client.setApiKeySecret(key, secret);
    }

    authenticate = async() => {
        this.walletAPI = new GateApi.WalletApi(this.client);
        this.spotAPI = new GateApi.SpotApi(this.client);

        try {
            await this.walletAPI.getTotalBalance(this.cfg);
            this.authenticated = true;
        }
        catch {
            this.authenticated = false;
        }
    }

    getBalance = async() => {
        const data = await this.walletAPI.getTotalBalance(this.cfg);
        return data.body;
    }

    listTickers = async(currencyPair='') => {
        const data = await this.spotAPI.listTickers({
            currencyPair: currencyPair
        })
        return data.body;
    }

    createOrder = async(currencyPair='', side='', price='', amount='') => {
        const order = new Order();
        order.currencyPair = currencyPair;
        order.side = side;
        order.price = price;
        order.amount = amount;
        
        const data = await this.spotAPI.createOrder(order);
        return data.body;
    }
}


module.exports = { GateClient };