const Multisig = require("lib/multisig");

async function main(masterKey, quorum, signerLists, regularKeys) {
  try {
    const m = new Multisig(masterKey.address, quorum);
    const entries = m.setupSignerList(signerLists);
    const txjson = await m.setupMultisig(entries);
    const res = await m.broadCast(txjson, masterKey.secret);
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const masterKey = JSON.parse(process.env.MASTER_KEY);
const quorum = process.env.QUORUM;
const signerLists = JSON.parse(process.env.SIGNER_LISTS);
const regularKeys = JSON.parse(process.env.REGULAR_KEYS);

main(masterKey, quorum, signerLists, regularKeys);
