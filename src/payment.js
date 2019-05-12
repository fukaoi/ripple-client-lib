const Address = require("./address");
const BigNumber = require("bignumber.js");

module.exports = class Payment {
  constructor(ripplelib, masterAddress) {
    this.api = ripplelib;
    this.masterAddress = masterAddress;
  }

  createTransaction(amount, toAddress, tags = {source: 0, destination: 0}, memos = []) {
    let sobj = {
      source: {
        address: this.masterAddress,
        amount: { value: `${amount}`, currency: "XRP" }
      }
    };

    // source tag
    if (tags.source > 0) sobj.source.tag = tags.source;

    let dobj = {
      destination: {
        address: toAddress,
        // minAmount:   {value: '' + amount, currency: 'XRP' }} // check, need???
        minAmount: { value: `${amount}`, currency: "XRP" }
      }
    };

    // destination tag
    if (tags.destination > 0) dobj.destination.tag = tags.destination;
    let merged = Object.assign(sobj, dobj);

    // Memo
    if (memos.length) merged.memos = memos;
    
    return merged;
  }

  async preparePayment(txRaw, quorum, fee) {
      const seq = await new Address(this.api).getSequence(this.masterAddress);
      const instructions = {
        fee: `fee`,
        sequence: seq,
        signersCount: quorum
      };
      const tx = await this.api.preparePayment(
        this.masterAddress,
        txRaw,
        instructions
      );
      return tx.txJSON;
  }

  async setupSignerSignning(json, regularKeys) {
      let signeds = [];
      for (let i = 0; i < regularKeys.length; i++) {
        let signed = await this.api.sign(json, regularKeys[i].secret, { signAs: regularKeys[i].address }
        );
        signeds.push(signed);
      }
      return signeds;
  }

  async broadCast(signeds) {
      const setupCombine = (signeds = []) => {
        return signeds.map(sig => {
          return sig.signedTransaction;
        });
      };
      const combined = this.api.combine(setupCombine(signeds));
      const res = await this.api.submit(combined.signedTransaction);
      return res;
  }
};
