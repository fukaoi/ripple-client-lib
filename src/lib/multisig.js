module.exports = class Multisig {
  constructor(masterAddress) {
    this.masterAddress = masterAddress;
  }

  async setupMultisig(quorum, fee, seq) {
    const txjson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.masterAddress,
      'Sequence': seq,
      'Fee': fee,
      'SignerQuorum': quorum,
      'SignerEntries': this.signer_entries,
    }    
    return txjson;
  }

  setupSignerList() {
  
  }

  setupSignerSiggning(signers = [], payment_json) {
    let signeds = [];
    for(let i = 0; i < this.quorum; i++) {
      let signed = this.api.sign(
        payment_json, 
        signers[i].secret, 
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

