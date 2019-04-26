const RippleAPI = require('ripple-lib').RippleAPI;

class SendMultisig {
  constructor(srv, master_key, regular_keys, quorum) {
    this.api = new RippleAPI({server: srv});
    this.master_key = master_key;
    this.regular_keys = regular_keys;
    this.quorum = quorum;
  }

  async connect() {
    await this.api.connect();
  }

  async getSequence(address) {
    const account_info = await this.api.getAccountInfo(address);
    return account_info.sequence;
  }

  setupMultisigTransaction(to, amount, tags, memos) {
    let s = {
      source: {address: this.master_key.address,
        amount: {value: amount, currency: 'XRP'}}
    };
    
    let d = {
      destination: {address: to, 
        minAmount: {value: '' + amount, currency: 'XRP' }}  
    };

    if (tags.source) s.tag = tags.source;
    if (tags.destination) d.tag = tags.destination;
    let sd = Object.assign(s, d);
    if (memos.length) sd.memos = [memos];
    return sd;
  }

  // fee : signed number // fee:10 drops success
  // fee: '0.000009',     // fee * signed number // fee:9 drops failed
  async preparePayment(fee, txjson) {
    const seq = await this.getSequence(this.master_key.address); 
    const instructions = {
        fee: fee,  
        sequence: seq,
        signersCount: parseInt(this.quorum, 10) 
    };
    const json = await this.api.preparePayment(
      this.master_key.address, 
      txjson, 
      instructions
    );
    return json;
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
    // signers.forEach((signer) => {
      // let signed = this.api.sign(payment_json, signer.secret, {signAs: signer.address}); 
      // signeds.push(signed);
    // });
    return signeds;
  }

  setupCombined(signeds = []) {
    return signeds.map((sig) => {
      return sig.signedTransaction; 
    }); 
  }

  async main(
    fee, to, amount, 
    tags = {souce:'', destination:''}, memos = {}
  ) {
    try {
      await this.connect();
      const txjson = this.setupMultisigTransaction(to, amount, tags, memos);
      const payjson  = await this.preparePayment(fee, txjson);
      const signed = this.setupSignerSiggning(this.regular_keys, payjson.txJSON);
      const combined = this.api.combine(this.setupCombined(signed));
      const receipt  = await this.api.submit(combined.signedTransaction);
      console.log("receipt\n", receipt);
    } catch(e) {
      console.error(e);
    } finally {
      this.api.disconnect();
    }  
  }
}



const srv = process.env.SERVER;
const master_key = JSON.parse(process.env.MASTER_KEY);
const regular_keys = JSON.parse(process.env.REGULAR_KEYS);
const quorum = process.env.QUORUM;
const fee = process.env.FEE;
const to = process.env.TO;
const amount = process.env.AMOUNT;

// ### Fee ### 
  // quorum:1  12 * (1 + 1) => 24 // demerit single transaction
  // quorum:3  12 * (1 + 3) => 48
  // quorum:3  12 * (1 + 3) => 48
  // quorum:1 にしても、combine数に影響してしまうので、combinedを変更すべき
const send = new SendMultisig(srv, master_key, regular_keys, quorum);
send.main(fee, to, amount);




