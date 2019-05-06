const Define = require('./define');
const Multisig = require('../src/lib/multisig');
const Client = require('../src/lib/client');
const Address = require('../src/lib/address');

let multisig;
const weight = 1;
const quorum = 3;

beforeAll(() => {
  const api = Client.instance;
  api.connect();
});

afterAll(() => {
  multisig.api.disconnect();
});

test('Setup signer list', async () => {
  const masterAddress = await Define.address();
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  expect(entries).toHaveLength(quorum);
  expect(entries[0].SignerEntry.Account).toHaveLength(34);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

test('Setup multisig', async () => {
  const masterAddress = await Define.address();
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  const txjson = await multisig.setupMultisig(entries);
  const account = JSON.parse(txjson).Account;
  expect(account).toBe(masterAddress);
});

test('Setup signer signning', async () => {
  const masterAddress = await Define.address();
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  const txjson = await multisig.setupMultisig(entries);
  const res = multisig.setupSignerSignning(await createRegularKeys(), txjson)
  console.log(res);
});

async function createSigners() {
  let signers = [];
  for (let i = 0; i < quorum; i++) {
    let signer = {
      address: await Define.address(), 
      weight: weight
    }   
    signers.push(signer)
  }
  return signers; 
}

async function createRegularKeys() {
  const address = new Address();
  let regulars = [];
  for (let i = 0; i < quorum; i++) {
    regulars.push(await address.newAddress());
  }
  return regulars;
}
