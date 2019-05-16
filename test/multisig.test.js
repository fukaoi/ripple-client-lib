const Define = require('./define');
const Multisig = require('../src/lib/multisig')
const Address = require('../src/lib/address')
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);
const m = new Multisig(api);

let masterAccount;

beforeAll(async () => {
  await api.connect();
  masterAccount = await a.newAccountTestnet();
  a.setInterval(5000);
})

afterAll(async () => {
  await api.disconnect();
})

const weight = 1;
const quorum = 3;
const fee = 10 * quorum;

test("Create signer list", async () => {
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  expect(entries).toHaveLength(quorum);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

test("Setup multisig", async () => {
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  const txjson = await m.setupMultisig(masterAccount.address, entries, 3, fee);
  const json = JSON.parse(txjson);
  expect(json.Account).toBe(masterAccount.address);
  expect(json.Fee).toBe(`${fee}`);
});

test("Do broadcast ", async () => {
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  const txjson = await m.setupMultisig(masterAccount.address, entries, 3, fee);
  const tx = await m.broadCast(txjson, masterAccount.secret);
  expect(tx.resultCode).toBe('tesSUCCESS');
  expect(tx.tx_json.hash).toHaveLength(64);
});

// test.only("Invalid params createSignerList()", () => {
  // expect(m.createSignerList()).toThrow();
  // await expect(m.createSignerList(null)).rejects.toThrow(Error);
  // expect(m.createSignerList(undefined)).rejects.toThrow(Error);
  // await expect(m.createSignerList([1,2,3,4])).toThrow(Error);
  // expect(m.createSignerList([{address: "", weight: 0 }])).rejects.toThrow(Error);
// });

test("Invalid params setupMultisig()", async () => {
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  await expect(m.setupMultisig('')).rejects.toThrow();
  await expect(m.setupMultisig('', [], 0, 0)).rejects.toThrow();
  await expect(m.setupMultisig(masterAccount.address, entries, 2, -1)).rejects.toThrow();
  await expect(m.setupMultisig(masterAccount.address, entries, 0, 0.5)).rejects.toThrow();
  await expect(m.setupMultisig(masterAccount.address, entries, -1, 0.5)).rejects.toThrow();
});

test("Invalid params broadCast() ", async () => {
  await expect(m.broadCast()).rejects.toThrow();
  await expect(m.broadCast('', '')).rejects.toThrow();
  await expect(m.broadCast('xxxxxxxxxxxx', 'hogehoge')).rejects.toThrow();
  await expect(m.broadCast('xxxxxxxxxxxx', 'ssJaD4Gq2JucUJwjQm8cRafkTvVos')).rejects.toThrow();
});



