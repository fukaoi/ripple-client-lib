const Define = require('./define');
const Multisig = require('../src/multisig')
const Address = require('../src/address')
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);

let masterAddress;

beforeAll(async () => {
  account = await a.newAccountTestnet();
  masterAddress = account.address;
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
  const txjson = await m.setupMultisig(masterAddress, entries, 3, fee);
  const json = JSON.parse(txjson);
  expect(json.Account).toBe(masterAddress);
  expect(json.Fee).toBe(`${fee}`);
});


