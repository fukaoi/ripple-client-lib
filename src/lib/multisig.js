module.exports = class Multisig {
  constructor(srv, master_key, signer_entries) {
    this.api = new RippleAPI({server: srv});
    this.master_key = master_key;
    this.signer_entries = signer_entries;
  }

  async setupMultisig(quorum, fee) {
    const seq = await this.getSequence(this.master_key.address); 
    const txjson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.master_key.address,
      'Sequence': seq,
      'Fee': `${parseInt(fee, 10) * quorum}`,
      'SignerQuorum': quorum,
      'SignerEntries': this.signer_entries,
    }    
    return txjson;
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

const srv = process.env.SERVER;
const quorum = process.env.QUORUM;
const fee = process.env.FEE;
const master_key = JSON.parse(process.env.MASTER_KEY);
const signer_entries = JSON.parse(process.env.SIGNER_ENTRIES);
