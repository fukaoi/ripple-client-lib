module.exports = class Address {

  async getSequence(address) {
    const account_info = await this.api.getAccountInfo(address);
    return account_info.sequence;
  }

  async newAddress() {
    return await this.api.generateAddress();
  }
}
