let Api = require('./api');

module.exports = class Address extends Api{
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
    return await this.api.generateAddress();
  }
}
