const Payment = require('lib/payment');

async function main(masterAddress, destionAddress, regularKeys, amount, quorum, tags, memos) {
  try {
    const p = new Payment(masterAddress, regularKeys);

    const source = p.createSouce(amount, tags.source);
    const destination = p.createDestination(amount, destionAddress, tags.destination);
    const txRaw = p.setupTransaction(source, destination, memos);
    const txJson = await p.preparePayment(txRaw, quorum);
    const regularKeySingneds = await p.setupSignerSignning(txJson);
    const res = await p.broadCast(regularKeySingneds);
    console.log(JSON.stringify(res));
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

const masterAddress = JSON.parse(process.env.MASTER_KEY).address;
const destionAddress = process.env.TO;
const quorum = parseInt(process.env.QUORUM);
const signerLists = JSON.parse(process.env.SIGNER_LISTS);
const regularKeys = JSON.parse(process.env.REGULAR_KEYS);
const amount = JSON.parse(process.env.AMOUNT);
const tags = JSON.parse(process.env.TAGS);
const memos = JSON.parse(process.env.MEMOS);

main(masterAddress, destionAddress, regularKeys, amount, quorum, tags, memos);
