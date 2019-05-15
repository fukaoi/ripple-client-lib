const Address = require("./address");
const BigNumber = require("bignumber.js");

module.exports = class Payment {
  constructor(ripplelib, masterAddress) {
    this.api = ripplelib;
    this.a = new Address(ripplelib);
    this.masterAddress = masterAddress;
  }

  createTransaction(amount, toAddress, tags = {source: 0, destination: 0}, memos = []) {
    if (!amount || amount < 0) {
      throw new Error(`amount is invalid: ${amount}`); 
    }
    if (!this.a.isValidAddress(toAddress)) {
      throw new Error(`Validate error address: ${toAddress}`);
    }

    let sobj = {
      source: {
        address: this.masterAddress,
        amount: { value: `${amount}`, currency: "XRP" }
      }
    };

    // source tag
    const sourceId = parseInt(tags.source);
    if (sourceId > 0) sobj.source.tag = sourceId;

    let dobj = {
      destination: {
        address: toAddress,
        // minAmount:   {value: '' + amount, currency: 'XRP' }} // check, need???
        minAmount: { value: `${amount}`, currency: "XRP" }
      }
    };

    // destination tag
    const destinationId = parseInt(tags.destination);
    if (destinationId > 0) dobj.destination.tag = destinationId;
    let merged = Object.assign(sobj, dobj);

    // Memo
    if (memos.length) merged.memos = memos;
    
    return merged;
  }

  async preparePayment(tx, quorum, fee) {
    if (!tx || !quorum || quorum < 1 || !fee || fee < 0) {
      throw new Error(`Set params(tx, quorum, fee) is invalid: ${tx}, ${quorum}, ${fee}`); 
    }
    const seq = await this.a.getSequence(this.masterAddress);
    const instructions = {fee: `${fee}`, sequence: seq, signersCount: Number(3)};
    const txRaw = await this.api.preparePayment(
      this.masterAddress,
      tx,
      instructions
    );
    return txRaw.txJSON;
  }

  async setupSignerSignning(json, regularKeys) {
    if (!json || !Array.isArray(regularKeys) || regularKeys.length == 0) {
      throw new Error(`Set params(json, regularKeys) is invalid: ${json}, ${regularKeys}`); 
    }
      let signeds = [];
      for (let i = 0; i < regularKeys.length; i++) {
        let signed = await this.api.sign(json, regularKeys[i].secret, { signAs: regularKeys[i].address }
        );
        signeds.push(signed);
      }
      return signeds;
  }

  async broadCast(signeds) {
    if (!Array.isArray(signeds) || signeds.length == 0) {
      throw new Error(`Signeds is invalid: ${signeds}`); 
    }
       const setupCombine = (signeds) => {
        return signeds.map(sig => {
          return sig.signedTransaction;
        });
      };
      const combined = this.api.combine(setupCombine(signeds));
      const res = await this.api.submit(combined.signedTransaction);
      return res;
  }

  async verifyTransaction(
    txhash, 
    options = {minLedgerVersion: 0, maxLedgerVersion: 0}
  ) {
    try {
      let res;
      if (options.minLedgerVersion > 1 && options.masterAddress > 1) {
        res = await this.api.getTransaction(txhash, options);
      } else {
        res = await this.api.getTransaction(txhash);
      }
      console.log("$$$$ res");
      return res;
    } catch(e) {
      if (e instanceof this.api.errors.PendingLedgerVersionError || 
          e instanceof this.api.errors.MissingLedgerHistoryError
      ) {
        //recursive, after 1sec inteval 
        console.log("do verify!");
        setTimeout(() => {this.verifyTransaction(txhash, options)}, 1000);
      }
      // throw new Error(e);
    } 
  }
};

function a() {
  return true
}
