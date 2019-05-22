const RippleAPI = require("ripple-lib").RippleAPI;
const Payment = require("lib/payment");

async function main(
  server,
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  tags,
  memos
) {
  const api = new RippleAPI({server: server});
  try {
    await api.connect();
    const p = new Payment(api, masterAddress);
    const tx = p.createTransaction(amount, toAddress, tags, memos);
    const txRaw = await p.preparePayment(tx, fee, regularKeys.length);
    const signeds = await p.setupSignerSignning(txRaw.txJSON, regularKeys);
    const res = await p.broadCastWithVerify(signeds, txRaw);
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
const tags          = JSON.parse(process.env.TAGS);
const memos         = JSON.parse(process.env.MEMOS);
 
main(
  server,
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  tags,
  memos
);
