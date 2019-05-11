const Define = require('./define');
const Multisig = require('../src/multisig')
const Address = require('../src/address')
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);

let masterAccount;

beforeAll(async () => {
  masterAccount = await a.newAccountTestnet();
  await api.connect();
})

afterAll(async () => {
  await api.disconnect();
})

const weight = 1;
const quorum = 3;
const fee = 10 * quorum;

test("Create signer list", async () => {
  const m = new Multisig(api);
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  expect(entries).toHaveLength(quorum);
  expect(entries[0].SignerEntry.Account).toHaveLength(34);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

test("Setup multisig", async () => {
  let m = new Multisig(api);
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  const txjson = await m.setupMultisig(masterAccount.address, entries, 3, fee);
  const json = JSON.parse(txjson);
  expect(json.Account).toBe(masterAccount.address);
  expect(json.Fee).toBe(`${fee}`);
});

test.only("Do broadcast ", async () => {
  let m = new Multisig(api);
  const signers = await Define.createSigners(a);
  const entries = m.createSignerList(signers);
  const txjson = await m.setupMultisig(masterAccount.address, entries, 3, fee);
  const tx = await m.broadCast(txjson, masterAccount.secret);
  console.log(tx);
  expect(tx.resultCode).toBe('tesSUCCESS');
  expect(tx.tx_json.hash).toHaveLength(64);
});


