const RippleAPI = require('ripple-lib').RippleAPI;


class CreateSignerList {
  constructor(srv, master_key, signer_entries) {
    this.api = new RippleAPI({server: srv});
    this.master_key = master_key;
    this.signer_entries = signer_entries;
  }

  async connect() {
    await this.api.connect();
  }

  async getSequence(address) {
    const account_info = await this.api.getAccountInfo(address);
    return account_info.sequence;
  }

  async setupMultisig(quorum, fee) {
    const seq = await this.getSequence(this.master_key.address); 
    const txjson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.master_key.address,
      'Sequence': seq,
      'Fee': '30',
      'SignerQuorum': quorum,
      'SignerEntries': this.signer_entries,
    }    
    return txjson;
  }

  async main(quorum, fee) {
    try {
      await this.connect();
      const txjson =   await this.setupMultisig(quorum, fee);
      console.log(txjson);
      const signedTx = await this.api.sign(JSON.stringify(txjson), this.master_key.secret);
      const receipt =  await this.api.submit(signedTx.signedTransaction)
      console.log("receipt\n", receipt)
    } catch(e) {
      console.error(e);
    } finally {
      this.api.disconnect();
    }
  }
}

const srv = process.env.SERVER;
const quorum = process.env.QUORUM;
const fee = process.env.FEE;
const master_key = JSON.parse(process.env.MASTER_KEY);
const signer_entries = JSON.parse(process.env.SIGNER_ENTRIES);

const list = new CreateSignerList(srv, master_key, signer_entries);
list.main(quorum, fee);
