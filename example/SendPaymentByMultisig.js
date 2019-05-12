const RippleAPI = require("ripple-lib").RippleAPI;
const SERVER = "wss://s.altnet.rippletest.net:51233";
const Payment = require("../src/payment");

async function main(
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  quorum,
  tags,
  memos
) {
  const api = new RippleAPI({ server: SERVER });
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
  }
}

const masterAddress = "raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp";
const toAddress = "rsGPNkSLt36BDLMgPAYKifFvCphQJZ2qJw";
const regularKeys = [
  {
    address: "rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS",
    secret: "ssJaD4Gq2JucUJwjQm8cRafkTvVos"
  },
  {
    address: "rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK",
    secret: "sskWD5YudzgV8c2PLMnEiTVWZfWty"
  },
  {
    address: "rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6",
    secret: "spzAGSGjHVqLrbseewsivtG1ah8GP"
  }
];
const amount = 100;
const quorum = 3;
const fee = 0.00001;
const tags = {source: 8, destination: 1024}
const memos = [];
// const memos = [
  // {
    // type: "payment test",
    // format: "text/plain",
    // data: "SendPaymentByMultisig"
  // }
// ];

main(
  masterAddress,
  toAddress,
  regularKeys,
  amount,
  fee,
  quorum,
  tags,
  memos
);
