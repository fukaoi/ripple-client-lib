let Client = require('./client');
const req = require('request');

module.exports = class Address extends Client{
  constructor(srv = '') {
    super(srv); 
  }

  async getSequence(address) { 
    if (!address) {
      throw new Error('No set address');
    }
    const account_info = await this.api.getAccountInfo(address);
    return account_info.sequence;
  }

  async newAddress() {
    const created = await this.api.generateAddress();
    return created;
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
