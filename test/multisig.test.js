const Define = require('./define');
const Multisig = require('../src/lib/multisig');
const Client = require('../src/lib/client');

let multisig;
let signers = [];
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
  const res = await multisig.setupMultisig(entries);
  expect(res.Account).toBe(masterAddress);
});

async function createSigners() {
  if (signers.length > 0) return signers;
  for (let i = 0; i < quorum; i++) {
    let signer = {
      address: await Define.address(), 
      weight: weight
    }   
    signers.push(signer)
  }
  return signers; 
}
