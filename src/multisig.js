const Address = require("./address");
const Util = require('util');

module.exports = class Multisig {
  constructor(ripplelib) {
    this.api = ripplelib;
  }

  async setupMultisig(masterAddress, signerEntries, quorum, fee) {
    if (!masterAddress || !quorum || !fee) {
      throw new Error(`Set params(masterAddress, quorum, fee) is invalid`);
    }

    if (signerEntries.length == 0) {
      throw new Error(`signerEntries is invalid: ${Util.inspect(signerEntries)}`);
    }

    const seq = await new Address(this.api).getSequence(masterAddress);
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

  createSignerList(signers = [{ address: "", weight: 0 }]) {
    if (signers.length == 0 || !signers[0].address || signers[0].weight < 1) {
      throw new Error(`signers is invalid: ${signers}`);
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

  async broadCast(txjson, secret) {
    if (!txjson || !secret) {
      throw new Error(`Set params(txjson, secret) is invalid: ${txjson}, ${secret}`);
    }
    const signedTx = await this.api.sign(txjson, secret);
    const res = await this.api.submit(signedTx.signedTransaction);
    return res;
  }
};
