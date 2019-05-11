const Client = require('./client');
const Address = require('./address');
const BigNumber = require('bignumber.js');

module.exports = class Payment {
  
  constructor(masterAddress, regularKeys) {
    this.masterAddress = masterAddress; 
    this.regularKeys = regularKeys;
    this.api = Client.instance;
  }

  createSouce(amount, tag = 0) {
    let obj = {
      source: {address: this.masterAddress,
      amount: {value: `${amount}`, currency: 'XRP'}}
    };
    if (tag > 0) obj.source.tag = tag;
    return obj;
  }

  createDestination(amount, toAddress, tag = 0) {
    let obj = {
        destination: {address: toAddress, 
        // minAmount:   {value: '' + amount, currency: 'XRP' }} // check, need??? 
        minAmount:   {value: `${amount}`, currency: 'XRP' }}  
    };
    if (tag > 0) obj.destination.tag = tag;
    return obj;
  }

  setupTransaction(srcObj, destObj, memos = []) {
    let merged = Object.assign(srcObj, destObj) 
    if (memos.length) merged.memos = memos;
    return merged;
   }

  async preparePayment(txRaw, quorum) {
    try {
      const a = new Address();
      const seq = await a.getSequence(this.masterAddress);

      await this.api.connect();
      const instructions = {
        fee: `${this.setupFee(this.regularKeys.length)}`,  
        sequence: seq,
        signersCount: quorum 
      };
      const tx = await this.api.preparePayment(
        this.masterAddress, 
        txRaw,
        instructions
       );
       return tx.txJSON;
    } catch(e) {
      throw new Error(e); 
    } finally {
      await this.api.disconnect();
    }
  }

  setupFee(signersCount) {
    const fee = 0.00001; 
    const x = new BigNumber(fee);
    const y = new BigNumber(signersCount);
    return x.times(y).toNumber();
  }

  async setupSignerSignning(payment_json) {
    try {
      await this.api.connect();
      let signeds = [];
      for(let i = 0; i < this.regularKeys.length; i++) {
        let signed = await this.api.sign(
          payment_json, 
          this.regularKeys[i].secret, 
          {signAs: this.regularKeys[i].address}
        ); 
        signeds.push(signed);
      }
      return signeds;
    } catch(e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  }

  async broadCast(signeds) {
    try {
      await this.api.connect();
      const setupCombine = (signeds = []) => {
        return signeds.map((sig) => {
          return sig.signedTransaction; 
        }); 
      }
      const combined = this.api.combine(setupCombine(signeds));
      const res = await this.api.submit(combined.signedTransaction);
      return res;
    } catch(e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  }
}
