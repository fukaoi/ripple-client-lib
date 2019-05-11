const req = require('request');

module.exports = class Address{

  constructor(ripplelib) {
    this.api = ripplelib;
    this.INTERVAL = 1000;
  }

  async getSequence(address) { 
    const info = await this.api.getAccountInfo(address);
    return info.sequence;
  }

  // need not rippled connect()
  async newAddress() {
    const created = await this.api.generateAddress();
    return created;
  }

  // only address in testnet
  async newAddressWithFaucet() {
    const options = {
      uri: 'https://faucet.altnet.rippletest.net/accounts',
      headers: {"Content-type": "application/json"}
    } 

    const doRequest = (options) => {
      return new Promise((resolve, reject) => {
        req.post(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(body);
          } else {
            reject(error);
          }
        });
      }); 
    }
    const res = await doRequest(options);
    this.setInterval(this.INTERVAL);
    return JSON.parse(res).account;
  }

  setInterval(waitMsec) {
    const startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}}


