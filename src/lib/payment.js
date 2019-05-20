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

  async submit(tx, fee, secret) {
    if (!tx || !fee) {
      throw new Error(`Set params(tx, fee) is invalid: ${tx}, ${fee}`); 
    }
    const seq = await this.a.getSequence(this.masterAddress);
    const instructions = {fee: `${fee}`, sequence: seq};
    const txRaw = await this.api.preparePayment(
      this.masterAddress,
      tx,
      instructions
    );
    const signed = await this.api.sign(txRaw.txJSON, secret);
    return await this.api.submit(signed.signedTransaction);
  }

  async preparePayment(tx, fee) {
    if (!tx || !fee || fee < 0) {
      throw new Error(`Set params(tx, fee) is invalid: ${tx}, ${fee}`); 
    }
    const seq = await this.a.getSequence(this.masterAddress);
    const instructions = {
      fee: `${fee}`, 
      sequence: seq, 
      signersCount: Number(3),
      maxLedgerVersionOffset: 5,
    };
    const txRaw = await this.api.preparePayment(
      this.masterAddress,
      tx,
      instructions
    );
    return txRaw;
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
    return await this.api.submit(combined.signedTransaction);
  }

  async broadCastWithVerify(signeds, prepared) {
    if (!Array.isArray(signeds) || signeds.length == 0) {
      throw new Error(`Signeds is invalid: ${signeds}`); 
    }
    const setupCombine = (signeds) => {
      return signeds.map(sig => {
        return sig.signedTransaction;
      });
    };
    const combined = this.api.combine(setupCombine(signeds));
    const firstRes = await this.api.submit(combined.signedTransaction);
    const options = {
      minLedgerVersion: await this.api.getLedger().ledgerVerrsion,
      maxLedgerVersion: prepared.instructions.maxLedgerVersion
    };
    this.a.setInterval(3000);
    return this.verifyTransaction(firstRes.tx_json.hash, options); 
  }

  verifyTransaction(hash, options) {
    console.log("Verify loop");
    return this.api.getTransaction(hash, options).then(data => {
      return data;
    }).catch(e => {
      if (e instanceof this.api.errors.PendingLedgerVersionError) {
        return new Promise((resolve, reject) => {
          setTimeout(() => this.verifyTransaction(hash, options)
            .then(resolve, reject), 1000);
        });
      }
      throw new Error(e);
    });    
  }
};

