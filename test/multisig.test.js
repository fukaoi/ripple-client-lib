const Define = require('./define');
const Multisig = require('../src/lib/multisig');
const Client = require('../src/lib/client');
const Address = require('../src/lib/address');

let multisig;
let masterAddress;
const weight = 1;
const quorum = 3;

beforeAll(async() => {
  masterAddress = await Define.address();
  const api = Client.instance;
  api.connect();
});

afterAll(() => {
  multisig.api.disconnect();
});

test('Setup signer list', async () => {
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  expect(entries).toHaveLength(quorum);
  expect(entries[0].SignerEntry.Account).toHaveLength(34);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

test('Setup fee by quorum', () => {
  multisig = new Multisig(masterAddress, quorum);
  const fee = multisig.setupFee(); 
  expect(fee).toBe(30);
});

test('Setup multisig', async () => {
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  const txjson = await multisig.setupMultisig(entries);
  const account = JSON.parse(txjson).Account;
  expect(account).toBe(masterAddress);
});

test('Setup signer signning', async () => {
  multisig = new Multisig(masterAddress, quorum);
  const entries = multisig.setupSignerList(await createSigners())
  const txjson = await multisig.setupMultisig(entries);
  const res = multisig.setupSignerSignning(await createRegularKeys(), txjson)
  expect(res).toHaveLength(quorum);
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
