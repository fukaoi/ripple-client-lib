const Client  = require('./client');
const Payment = require('./payment');
const Address = require('./address');
const BigNumber = require('bignumber.js');

module.exports = class Multisig {
  constructor(masterAddress, quorum) {
    this.masterAddress = masterAddress;
    this.quorum = quorum;
    this.api = Client.instance;
  }
  
  async setupMultisig(signerEntries) {
    try {
      await this.api.connect();
      //todo: what Flags???
      const seq = await new Address().getSequence(this.masterAddress);
      const txjson = {
        'Flags': 0,
        'TransactionType': 'SignerListSet',
        'Account': this.masterAddress,
        'Sequence': seq,
        'Fee': `${this.setupFee()}`,
        'SignerQuorum': this.quorum,
        'SignerEntries': signerEntries
      }    
      return JSON.stringify(txjson);
    } catch(e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  }

  setupSignerList(signers = [{address:'', weight: 0}]) {
    let signerEntries = [];
    signers.map((signer) => {
      let entry = {
        SignerEntry: {Account: signer.address, SignerWeight: signer.weight}
      };
      signerEntries.push(entry);  
    }); ;
    return signerEntries;
  }

  async setupSignerSignning(regularKeys = [], payment_json) {
    try {
      await this.api.connect();
      let signeds = [];
      for(let i = 0; i < this.quorum; i++) {
        let signed = await this.api.sign(
          payment_json, 
          regularKeys[i].secret, 
          {signAs: regularKeys[i].address}
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

  setupFee() {
    const drops = 1000000;
    const x = new BigNumber(Payment.setupFee() * drops);
    const y = new BigNumber(this.quorum);
    return x.times(y).toNumber();
  }

  setupCombined(signeds = []) {
    return signeds.map((sig) => {
      return sig.signedTransaction; 
    }); 
  }

  async broadCast(txjson, secret) {
    try {
      await this.api.connect();
      const signedTx = await this.api.sign(txjson, secret);
      const res = await this.api.submit(signedTx.signedTransaction);
      return res;
    } catch(e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  } 
 }

