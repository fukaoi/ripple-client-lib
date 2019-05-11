const Payment = require("lib/payment");

async function main(
  masterAddress,
  destinationAddress,
  regularKeys,
  amount,
  quorum,
  tags,
  memos
) {
  try {
    const p = new Payment(masterAddress, regularKeys);

    const source = p.createSouce(amount, tags.source);
    const destination = p.createDestination(
      amount,
      destinationAddress,
      tags.destination
    );
    const txRaw = p.setupTransaction(source, destination, memos);
    const txJson = await p.preparePayment(txRaw, quorum);
    const regularKeySingneds = await p.setupSignerSignning(txJson);
    const res = await p.broadCast(regularKeySingneds);
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const masterAddress = JSON.parse(process.env.MASTER_KEY).address;
const destinationAddress = process.env.TO;
const quorum = parseInt(process.env.QUORUM);
const regularKeys = JSON.parse(process.env.REGULAR_KEYS);
const amount = JSON.parse(process.env.AMOUNT);
const tags = JSON.parse(process.env.TAGS);
const memos = JSON.parse(process.env.MEMOS);

main(
  masterAddress,
  destinationAddress,
  regularKeys,
  amount,
  quorum,
  tags,
  memos
);
