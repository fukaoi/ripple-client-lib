const Address = require("./address");

module.exports = class Multisig {
  constructor(ripplelibs) {
    this.api = ripplelib;
  }

  async setupMultisig(masterAddres, signerEntries, quorum, fee) {
      if (!masterAddress || !quorum || !fee) {
        throw new Error(`Set params(masterAddress, quorum, fee) is invalid`); 
      }
      const seq = await new Address().getSequence(masterAddress);
      //todo: what Flags???
      const txjson = {
        Flags: 0,
        TransactionType: "SignerListSet",
        Account: this.masterAddress,
        Sequence: seq,
        Fee: `${fee}`,
        SignerQuorum: quorum,
        SignerEntries: signerEntries
      };
      return JSON.stringify(txjson);
  }

  createSignerList(signers = [{ address: "", weight: 0 }]) {
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
    const signedTx = await this.api.sign(txjson, secret);
    const res = await this.api.submit(signedTx.signedTransaction);
    return res;
  }
};
