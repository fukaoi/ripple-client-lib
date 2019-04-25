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
    return await this.api.getAccountInfo(address)
  }

  async setupMultisig(quorum, fee) {
    const seq = await this.getSequence(); 
    const txJson = {
      'Flags': 0,
      'TransactionType': 'SignerListSet',
      'Account': this.master_key.address,
      'Sequence': seq,
      'Fee': this.fee,
      'SignerQuorum': this.quorum,
      'SignerEntries': this.signers,
    }    
    return txJson;
  }

  async main(quorum, fee) {
    try {
      await this.connect();
      const txJson =   await setupMultisig(quorum, fee)
      const signedTx = await api.sign(JSON.stringify(txJson), master_key.secret)
      const receipt =  await api.submit(signedTx.signedTransaction)
      console.log("receipt\n", receipt)
    } catch(e) {
      console.error(e);
    } finally {
      this.api.disconnect();
    }
  }
}

const quorum = process.env.QUORUM;
const fee = 10;
if (process.env.FEE != undefined) {
  fee = process.env.FEE    
}

new CreateSignerList().main(quorum, fee);
