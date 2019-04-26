const RippleAPI = require('ripple-lib').RippleAPI;

class SendMultisig {
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

  setupMultisigTransaction(to, amount, memos, source_tag, destination_tag) {
    return {
      source: {
        address: this.master_key.address,
        amount: {value: amount, currency: 'XRP'},
        tag: source_tag,
      },
      destination: {
        address: to,
        minAmount: { value: '' + amount, currency: 'XRP' },
        tag: destination_tag,
      },  
      memos: [memos]  
    }
  }

  // fee : signed number // fee:10 drops success
  // fee: '0.000009',     // fee * signed number // fee:9 drops failed
  async preparePayment(quorum, fee, txjson) {
    const instructions = {
        fee: fee,  
        sequence: this.getSequence(this.master_key.address),
        signersCount: quorum 
    };
    return await this.api.preparePayment(this.master_key.address, txjson, instructions);
  }

  setupSignerSiggning(signers = [], txpayment_json) {
    let signeds = [];
    signers.forEatch((signer) => {
      let signed = this.api.sing(txpayment_json, signer.secret, {signAs: signer.address}); 
      signeds.push(signed);
    });
    return signeds;
  }

  async main() {
    try {
      await this.connect();
      const payment  = await api.preparePayment()
      const combinedTx = api.combine([sig1.signedTransaction, sig2.signedTransaction])
      const receipt  = await api.submit(combinedTx.signedTransaction)
      console.log("receipt\n", receipt)
    } catch(e) {
      console.error(e);
    } finally {
      this.api.disconnect();
    }  
  }
}



const srv = process.env.SERVER;
const master_key = JSON.parse(process.env.MASTER_KEY);
const signer_entries = JSON.parse(process.env.SIGNER_ENTRIES);

let fee = '10';
if (process.env.FEE != undefined) {
  fee = process.env.FEE
}    

// ### Fee ### 
  // quorum:1  12 * (1 + 1) => 24 // demerit single transaction
  // quorum:3  12 * (1 + 3) => 48
  // quorum:3  12 * (1 + 3) => 48
  // quorum:1 にしても、combine数に影響してしまうので、combinedを変更すべき
const send = new SendMultisig(srv, master_key, signer_entries);
send.main(quorum, fee);




