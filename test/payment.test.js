const Define = require("./define");
const Payment = require("../src/payment");
const Address = require("../src/address");
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);

let p;
let masterAccount;

beforeAll(async () => {
  api.connect();
  const regularKeys = await Define.createRegularKeys(a);
  masterAccount = await a.newAccountTestnet();
  p = new Payment(api, masterAccount.address);
});

afterAll(async () => {
  await api.disconnect();
});

test("Setup transacction", async () => {
  const amount = 77777;
  const toAccount = await a.newAccountTestnet();
  a.setInterval(5000);
  const tags = {source: 111, destination: 999}
  const memos = [
    {
      type: "test",
      format: "text/plain",
      data: "texted data"
    }
  ];
  const res = p.createTransaction(amount, toAccount.address, tags, memos);
  expect(res.source.address).toEqual(masterAccount.address);
  expect(res.destination.address).toEqual(toAccount.address); 
  expect(res.source.tag).toEqual(tags.source);
  expect(res.destination.tag).toEqual(tags.destination);
  expect(res.memos[0].type).toEqual("test");
  expect(res.memos[0].format).toEqual("text/plain");
  expect(res.memos[0].data).toEqual("texted data");
});

test("Prepare payment", async () => {
  // source obj
  const amount = "0.001";
  const srcObj = p.createSouce(amount);

  // dest obj
  const toAddress = await a.newAccountTestnet();
  // Until complete when created account in rippled network
  a.setInterval(5000);
  const destObj = p.createDestination(amount, toAddress);
  // setup transacction
  const tx = p.setupTransaction(srcObj, destObj);

  // prepara obj
  const json = await p.preparePayment(tx, 2);

  expect(json).toBeDefined();
});
