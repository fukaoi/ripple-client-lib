let Client = require('./client');

module.exports = class Address extends Client{
  constructor(srv = '') {
    super(srv); 
    this.connect();
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
}
