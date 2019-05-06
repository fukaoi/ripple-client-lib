const req = require('request');
const Client = require('./client');

module.exports = class Address{

  constructor() {
    this.api = Client.instance;
  }

  async getSequence(address) { 
    try {
      await this.api.connect();
      const account_info = await this.api.getAccountInfo(address);
      return account_info.sequence;
    } catch(e) {
      throw e; 
    } finally {
      await this.api.disconnect();
    }
  }

  async newAddress() {
    try {
      await this.api.connect();
      const created = await this.api.generateAddress();
      return created;
    } catch(e) {
      throw e; 
    } finally {
      await this.api.disconnect();
    }
  }

  async generateFaucet() {
    const options = {
      uri: 'https://faucet.altnet.rippletest.net/accounts',
      headers: {"Content-type": "application/json"}
    } 

    const doRequest = (options) => {
      return new Promise((resolve, reject) => {
        req.post(options, (error, response, body) => {
          if (!error &&  response.statusCode == 200) {
            resolve(body);
          } else {
            reject(error);
          }
        });
      }); 
    }
    const res = await doRequest(options);
    return res;
  }
}
