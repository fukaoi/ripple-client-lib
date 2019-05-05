const Client = require('./client');

module.exports = class Multisig extends Client {
  constructor(masterAddress) {
    this.masterAddress = masterAddress;
  }

  async setupMultisig(quorum, fee, seq, signerEngtries) {
    const txjson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.masterAddress,
      'Sequence': seq,
      'Fee': fee,
      'SignerQuorum': quorum,
      'SignerEntries': SignerEntries,
    }    
    return txjson;
  }

  setupSignerList(signers = [{address:'', weight: 0}]) {
  
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

  setupCombined(signeds = []) {
    return signeds.map((sig) => {
      return sig.signedTransaction; 
    }); 
  }
 }

