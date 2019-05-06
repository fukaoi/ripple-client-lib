const Client  = require('./client');
const Payment = require('./payment');

module.exports = class Multisig extends Client {
  constructor(masterAddress, quorum, srv = '') {
    super(srv);
    this.masterAddress = masterAddress;
    this.quorum = quorum;
  }

  async setupMultisig(seq, signerEngtries) {
    //todo: what Flags???
    const txjson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.masterAddress,
      'Sequence': seq,
      'Fee': this.setupFee(),
      'SignerQuorum': this.quorum,
      'SignerEntries': signerEntries,
    }    
    return txjson;
  }

  setupSignerList(signers = [{address:'', weight: 0}]) {
    let signerEntries = [];
    signers.map((signer) => {
      let entry = {
        SignerEntry: {Account: signer.address, SignerWeight: signer.weight}
      };
      signerEntries.push(entry);  
    }); 
    return signerEntries;
  }

  setupSignerSiggning(regularKeys = [], payment_json) {
    let signeds = [];
    for(let i = 0; i < this.quorum; i++) {
      let signed = this.api.sign(
        payment_json, 
        regularKeys[i].secret, 
        {signAs: signers[i].address}
      ); 
      signeds.push(signed);
    }
    return signeds;
  }

  setupFee() {
    Payment.setupFee() * this.quorum;  
  }

  setupCombined(signeds = []) {
    return signeds.map((sig) => {
      return sig.signedTransaction; 
    }); 
  }
 }

