module.exports = class Payment {
  createSouce() {
    return {
      source: {address: this.master_key.address,
        amount: {value: amount, currency: 'XRP'}}
    };
  }

  createDestination() {
    return {
      destination: {address: to, 
        minAmount: {value: '' + amount, currency: 'XRP' }}  
    };
  }

  tag_and_memo() {
  
  }

  async preparePayment(fee, txjson) {
    const seq = await this.getSequence(this.master_key.address); 
    const instructions = {
        fee: fee,  
        sequence: seq,
        signersCount: parseInt(this.quorum, 10) 
    };
    const json = await this.api.preparePayment(
      this.master_key.address, 
      txjson, 
      instructions
    );
    return json;
  }
}
