let Api = require('./api');

module.exports = class Address extends Api{
  constructor() {
    super(); 
  }

  async getSequence(address) {
    const account_info = await this.api.getAccountInfo(address);
    return account_info.sequence;
  }

  async newAddress() {
    return await this.api.generateAddress();
  }
}
