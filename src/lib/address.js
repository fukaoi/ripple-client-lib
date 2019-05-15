const req = require("request");

module.exports = class Address {
  constructor(ripplelib) {
    this.api = ripplelib;
  }

  async setFlags(address, settings) {
    if (!settings) {
      throw new Error(`settings is invalid: ${settings}`);
    }
    if (!this.isValidAddress(address)) {
      throw new Error(`Validate error address: ${address}`);
    }
    const tx = await this.api.prepareSettings(address, settings);
    return JSON.parse(tx.txJSON);
  }

  async getSequence(address) {
    if (!this.isValidAddress(address)) {
      throw new Error(`Validate error address: ${address}`);
    }
    const info = await this.api.getAccountInfo(address);
    return info.sequence;
  }

  // need not rippled connect()
  async newAccount() {
    const created = await this.api.generateAddress();
    return created;
  }

  // only address in testnet
  async newAccountTestnet() {
    const options = {
      uri: "https://faucet.altnet.rippletest.net/accounts",
      headers: { "Content-type": "application/json" }
    };

    const doRequest = options => {
      return new Promise((resolve, reject) => {
        req.post(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(body);
          } else {
            reject(error);
          }
        });
      });
    };
    const res = await doRequest(options);
    return JSON.parse(res).account;
  }

  isValidAddress(address) {
    return this.api.isValidAddress(address);
  }

  isValidSecret(secret) {
    return this.api.isValidSecret(secret);
  }

  setInterval(waitMsec) {
    const startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }

  async broadCast(txjson, secret) {
    if (!txjson || !secret) {
      throw new Error(
        `Set params(txjson, secret) is invalid: ${txjson}, ${secret}`
      );
    }
    if (!this.isValidSecret(secret)) {
      throw new Error(`Validate error secret: ${secret}`);
    }
    const signedTx = await this.api.sign(JSON.stringify(txjson), secret);
    const res = await this.api.submit(signedTx.signedTransaction);
    return res;
  }
};
