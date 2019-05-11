const Define = require('./define');
const Multisig = require('../src/multisig')
const Address = require('../src/address')
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);
const m = new Multisig(api);

let masterAccount;

beforeAll(async () => {
  await api.connect();
  masterAccount = await a.newAccountTestnet();
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

test.only("Invalid params createSignerList()",async () => {
  // expect(m.createSignerList([])).rejects.toThrow(Error);
  // await expect(m.createSignerList(null)).rejects.toThrow(Error);
  // expect(m.createSignerList(undefined)).rejects.toThrow(Error);
  await expect(m.createSignerList([1,2,3,4])).toThrow(Error);
  // expect(m.createSignerList([{address: "", weight: 0 }])).rejects.toThrow(Error);
});

