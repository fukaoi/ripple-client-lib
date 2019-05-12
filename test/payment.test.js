const Define = require("./define");
const Payment = require("../payment");
const Address = require("../adress");
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);

let p;
let masterAddress;

beforeAll(async () => {
  api.connect();
  const regularKeys = await Define.createRegularKeys();
  masterAccount = await a.newAccountTestnet();
  p = new Payment(masterAccount.address, regularKeys);
});

afterAll(async () => {
  await api.disconnect();
});

test("Create source object", () => {
  const amount = "0.001";
  const tag = 123;
  const res = p.createSouce(amount, tag);

  expect(res.source.address).toEqual(masterAddress);
  expect(res.source.amount.value).toEqual(amount);
  expect(res.source.amount.currency).toEqual("XRP");
  expect(res.source.tag).toEqual(tag);
});

test("Create destination object", async () => {
  const toAddress = await a.newAccountTestnet();
  // Until complete when created account in rippled network
  a.setInterval(5000);
  const amount = "0.001";
  const tag = 456;
  const res = p.createDestination(amount, toAddress, tag);

  expect(res.destination.address).toEqual(toAddress);
  expect(res.destination.minAmount.value).toEqual(amount);
  expect(res.destination.minAmount.currency).toEqual("XRP");
  expect(res.destination.tag).toEqual(tag);
});

test("Add memo and Setup transacction", () => {
  const srcObj = { source: {} };
  const destObj = { destination: {} };
  const memos = [
    {
      type: "test",
      format: "text/plain",
      data: "texted data"
    }
  ];
  const res = p.setupTransaction(srcObj, destObj, memos);

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
