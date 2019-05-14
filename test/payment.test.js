const Define = require("./define");
const Payment = require("../src/lib/payment");
const Address = require("../src/lib/address");
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});

const amount = 0.00077;
const tags = {source: 111, destination: 999}
const memos = [
  {
    type: "test",
    format: "text/plain",
    data: "texted data"
  }
];

const quorum = 3;
const fee = 0.00001;

let a;
let p;
let masterAccount;
let toAccount;
let regularKeys;

beforeAll(async () => {
  await api.connect();
  a = new Address(api);
  masterAccount = await a.newAccountTestnet();
  toAccount     = await a.newAccountTestnet();
  regularKeys   = await Define.createRegularKeys(a);
  a.setInterval(5000);
  p = new Payment(api, masterAccount.address);
});

afterAll(async () => {
  await api.disconnect();
});

test("Setup transacction", async () => {
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
  const tx = p.createTransaction(amount, toAccount.address, tags, memos);
  const res = await p.preparePayment(tx, quorum, fee);
  expect(res).toBeDefined();
  const obj = JSON.parse(res); 
  expect(obj.TransactionType).toEqual('Payment');
  expect(obj.Account).toEqual(masterAccount.address);
  expect(obj.Destination).toEqual(toAccount.address);
});

test("Setup signning", async () => {
  const tx = p.createTransaction(amount, toAccount.address, tags, memos);
  const json = await p.preparePayment(tx, quorum, fee);
  const res = await p.setupSignerSignning(json, regularKeys);
  expect(res.length).toEqual(regularKeys.length);
});

test("Boradcast", async () => {
  const tx = p.createTransaction(amount, toAccount.address, tags, memos);
  const json = await p.preparePayment(tx, quorum, fee);
  const signed = await p.setupSignerSignning(json, regularKeys);
  const res = await p.broadCast(signed);
  expect(res.resultCode).toEqual('tefNOT_MULTI_SIGNING');
  expect(res.tx_json.Fee).toEqual('40');
});

test("Verify transaction", async () => {
  txhash = '63BC7EAF14B032DF34E21F4BEC004A360D1FB5B260E8CBA6E92EB52639909C30';
  const res = await p.isVerify(txhash);
  expect(res).toEqual(true);
}); 

test("Verify transaction, add options at params", async () => {
  txhash = '63BC7EAF14B032DF34E21F4BEC004A360D1FB5B260E8CBA6E92EB52639909C30';
  const res = await p.isVerify(txhash);
  expect(res).toEqual('true');
}); 

test("Invalid params createTransaction()", () => {
  // jest incompatible on async/await (only Promise) 
  try {
    p.createTransaction(); 
  } catch (e) {
    console.log(e.message);
    expect(true).toEqual(true);
  }
  try {
    p.createTransaction('', ''); 
  } catch (e) {
    console.log(e.message);
    expect(true).toEqual(true);
  }
  try {
    p.createTransaction(100, ''); 
  } catch (e) {
    console.log(e.message);
    expect(true).toEqual(true);
  }
  try {
    p.createTransaction(100, 'xxxxxxxxxxxxxxxxxx'); 
  } catch (e) {
    console.log(e.message);
    expect(true).toEqual(true);
  }
  try {
    p.createTransaction(-1, 'rBshkANjvVbBBHwJZK74ZMv5LEnUuuxZKc'); 
  } catch (e) {
    console.log(e.message);
    expect(true).toEqual(true);
  }
});

test("Invalid params preparePayment()", async () => {
  expect(p.preparePayment()).rejects.toThrow();
  expect(p.preparePayment('', 3, 3)).rejects.toThrow();
  expect(p.preparePayment(null, 3, 3)).rejects.toThrow();
  expect(p.preparePayment('tx', '', '')).rejects.toThrow();
  expect(p.preparePayment('tx', 3, 0)).rejects.toThrow();
  expect(p.preparePayment('tx', 0, 3)).rejects.toThrow();
});

test("Invalid params setupSignerSignning()", async () => {
  expect(p.setupSignerSignning()).rejects.toThrow();
  expect(p.setupSignerSignning('', '')).rejects.toThrow();
  expect(p.setupSignerSignning('xxxxxx', [])).rejects.toThrow();
});

test("Invalid params broadCast()", async () => {
  expect(p.broadCast()).rejects.toThrow();
  expect(p.broadCast('')).rejects.toThrow();
  expect(p.broadCast([])).rejects.toThrow();
  expect(p.broadCast(10)).rejects.toThrow();
});


