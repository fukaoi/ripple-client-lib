const Define = require('./define');
const Multisig = require('../src/lib/multisig');
const Address = require('../src/lib/address');

let masterAddress;
const weight = 1;
const quorum = 3;

beforeAll(async() => {
  masterAddress = await Define.address();
});

test('Setup signer list', async () => {
  let multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await Define.createSigners())
  expect(entries).toHaveLength(quorum);
  expect(entries[0].SignerEntry.Account).toHaveLength(34);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

test('Setup fee by quorum', () => {
  let multisig = new Multisig(masterAddress, quorum);
  const fee = multisig.setupFee(); 
  expect(fee).toBe(30);
});

test('Setup multisig', async () => {
  let multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await Define.createSigners())
  const txjson = await multisig.setupMultisig(entries);
  const account = JSON.parse(txjson).Account;
  expect(account).toBe(masterAddress);
});



