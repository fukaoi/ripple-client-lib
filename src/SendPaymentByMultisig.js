const RippleAPI = require("ripple-lib").RippleAPI;
const Payment = require("lib/payment");

async function main(
  server,
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  quorum,
  tags,
  memos
) {
  const api = new RippleAPI({server: server});
  try {
    await api.connect();
    const p = new Payment(api, masterAddress);
    const tx = p.createTransaction(amount, toAddress, tags, memos);
    const txJson = await p.preparePayment(tx, quorum,fee);
    const signeds = await p.setupSignerSignning(txJson, regularKeys);
    const res = await p.broadCast(signeds);
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await api.disconnect();
    process.exit(0);
  }
}

const server        = process.env.SERVER;
const masterAddress = JSON.parse(process.env.MASTER_KEY).address;
const toAddress     = process.env.TO_ADDRESS;
const regularKeys   = JSON.parse(process.env.REGULAR_KEYS);
const amount        = process.env.AMOUNT;
const fee           = process.env.PAYMENT_FEE;
const quorum        = process.env.QUORUM;
const tags          = JSON.parse(process.env.TAGS);
const memos         = JSON.parse(process.env.MEMOS);
 
main(
  server,
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  quorum,
  tags,
  memos
);
