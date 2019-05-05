const Client = require('./client');

module.exports = class Payment extends Client {
  
  constructor(masterAddress, srv = '') {
    super(srv);
    this.masterAddress = masterAddress; 
  }

  createSouce(amount, tag = 0) {
    let obj = {
      source: {address: this.masterAddress,
      amount: {value: amount, currency: 'XRP'}}
    };
    if (tag > 0) obj.source.tag = tag;
    return obj;
  }

  createDestination(amount, toAddress, tag = 0) {
    let obj = {
        destination: {address: toAddress, 
        // minAmount:   {value: '' + amount, currency: 'XRP' }} // check, need??? 
        minAmount:   {value: amount, currency: 'XRP' }}  
    };
    if (tag > 0) obj.destination.tag = tag;
    return obj;
  }

  setupTransaction(srcObj, destObj, memos = []) {
    let merged = Object.assign(srcObj, destObj) 
    if (memos.length) merged.memos = memos;
    return merged;
   }

  setupFree() {
    return '0.00001'; 
  }

  async preparePayment(txjson, fee, quorum, seq) {
    const instructions = {
        fee: fee,  
        sequence: seq,
        signersCount: quorum 
    };
    const json = await this.api.preparePayment(
      this.masterAddress, 
      txjson,
      instructions
    );
    return json;
  }
}
