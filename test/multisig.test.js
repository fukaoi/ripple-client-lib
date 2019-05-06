const Define = require('./define');
const Multisig = require('../src/lib/multisig')

let multisig;

afterEach(() => {
  multisig.disconnect();
});

test('Setup signer list', async () => {
  const masterAddress = await Define.address();
  const weight = 1;
  const quorum = 3;
  multisig = new Multisig(masterAddress, quorum);
  let signers = [];
  for (let i = 0; i < quorum; i++) {
    let signer = {
      address: await Define.address(), 
      weight: weight
    }   
    signers.push(signer)
  }
  const entries = multisig.setupSignerList(signers)
  expect(entries).toHaveLength(3);
  expect(entries[0].SignerEntry.Account).toHaveLength(34);
  expect(entries[0].SignerEntry.SignerWeight).toBe(weight);
});

