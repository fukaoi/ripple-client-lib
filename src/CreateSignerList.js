const Multisig = require("./lib/multisig");
const RippleAPI = require("ripple-lib").RippleAPI;

async function main(server, masterKey, quorum, fee, signerLists, regularKeys) {
  const api = new RippleAPI({server: server});
  try {
    await api.connect();
    const m = new Multisig(api);
    const entries = m.createSignerList(signerLists);
    const txjson = await m.setupMultisig(
      masterKey.address,
      entries,
      quorum,
      fee
    );
    const res = await m.broadCast(txjson, masterKey.secret);
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await api.disconnect();
  }
}


const server      = process.env.SERVER;
const masterKey   = JSON.parse(process.env.MASTER_KEY);
const quorum      = process.env.QUORUM;
const fee         = process.env.FEE;
const signerLists = JSON.parse(process.env.SIGNER_LISTS);
const regularKeys = JSON.parse(process.env.REGULAR_KEYS);

main(server, masterKey, quorum, fee, signerLists, regularKeys);
