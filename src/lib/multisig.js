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

  setupSignerSignning(regularKeys = [], payment_json) {
    let signeds = [];
    for(let i = 0; i < this.quorum; i++) {
      let signed = this.api.sign(
        payment_json, 
        regularKeys[i].secret, 
        {signAs: regularKeys[i].address}
      ); 

      signeds.push(signed);
    }
    return signeds;
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
 }

