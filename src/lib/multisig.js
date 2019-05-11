const Client = require("./client");
const Address = require("./address");
const BigNumber = require("bignumber.js");

module.exports = class Multisig {
  constructor(masterAddress, quorum) {
    this.masterAddress = masterAddress;
    this.quorum = quorum; // todo: Need instance param?
    this.api = Client.instance;
  }

  async setupMultisig(signerEntries) {
    try {
      await this.api.connect();
      //todo: what Flags???
      const seq = await new Address().getSequence(this.masterAddress);
      const txjson = {
        Flags: 0,
        TransactionType: "SignerListSet",
        Account: this.masterAddress,
        Sequence: seq,
        Fee: `${this.setupFee(signerEntries.length)}`,
        SignerQuorum: this.quorum,
        SignerEntries: signerEntries
      };
      return JSON.stringify(txjson);
    } catch (e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  }

  setupSignerList(signers = [{ address: "", weight: 0 }]) {
    let signerEntries = [];
    signers.map(signer => {
      let entry = {
        SignerEntry: { Account: signer.address, SignerWeight: signer.weight }
      };
      signerEntries.push(entry);
    });
    return signerEntries;
  }

  setupFee() {
    const fee = 10;
    const x = new BigNumber(fee);
    const y = new BigNumber(this.quorum); // todo: miss signerCounts
    return x.times(y).toNumber();
  }

  async broadCast(txjson, secret) {
    try {
      await this.api.connect();
      const signedTx = await this.api.sign(txjson, secret);
      const res = await this.api.submit(signedTx.signedTransaction);
      return res;
    } catch (e) {
      throw new Error(e);
    } finally {
      await this.api.disconnect();
    }
  }
};
