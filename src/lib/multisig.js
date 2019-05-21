const Address = require("./address");
const Util = require("util");

module.exports = class Multisig {
  constructor(ripplelib) {
    this.api = ripplelib;
    this.a = new Address(ripplelib);
  }

  createSignerList(signers) {
    if (!Array.isArray(signers) || signers.length == 0 || !signers[0].address || signers[0].weight < 1) {
      throw new Error(`signers is invalid: ${Util.inspect(signers)}`);
    }
    let signerEntries = [];
    signers.map(signer => {
      let entry = {
        SignerEntry: { Account: signer.address, SignerWeight: signer.weight }
      };
      signerEntries.push(entry);
    });
    return signerEntries;
  }

  async setupMultisig(masterAddress, signerEntries, quorum, fee) {
    if (!quorum || quorum < 1 || !fee) {
      throw new Error(`Set params(quorum, fee) is invalid`);
    }

    if (!Array.isArray(signerEntries) || signerEntries.length == 0) {
      throw new Error(
        `signerEntries is invalid: ${Util.inspect(signerEntries)}`
      );
    }

    if (!this.a.isValidAddress(masterAddress)) {
      throw new Error(`Validate error address: ${masterAddress}`);
    }

    const seq = await this.a.getSequence(masterAddress);
    //todo: what Flags???
    const txjson = {
      Flags: 0,
      TransactionType: "SignerListSet",
      Account: masterAddress,
      Sequence: seq,
      Fee: `${fee}`,
      SignerQuorum: quorum,
      SignerEntries: signerEntries
    };
    return JSON.stringify(txjson);
  }

  async broadCast(txjson, secret) {
    if (!txjson || !secret) {
      throw new Error(
        `Set params(txjson, secret) is invalid: ${txjson}, ${secret}`
      );
    }
    if (!this.a.isValidSecret(secret)) {
      throw new Error(`Validate error secret: ${secret}`);
    }
    const signedTx = await this.api.sign(txjson, secret);
    const res = await this.api.submit(signedTx.signedTransaction);
    return res;
  }
};
