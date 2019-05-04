const config = require('config');
const Address = require('../src/lib/address')


let address;
let faucetAddress;

afterEach(() => {
  console.log('## Call after method. ##');
  address.disconnect();
});

beforeAll(async () => {
  address = new Address();
  const res = JSON.parse(await address.generateFaucet()); 
  console.log(res.account.address, res.account.secret, res.balance);
  faucetAddress = res.account.address;
});

test('Generate new address', async () => {
  address = new Address();
  await address.connect();
  const created = await address.newAddress();
  expect(created.secret).not.toBeUndefined();
  expect(created.address).not.toBeUndefined();
});


test('Get seq number', async () => {
  address = new Address();
  await address.connect();
  const seq = await address.getSequence(faucetAddress);
  console.log(seq);
});

test('No set param', async () => {
  address = new Address();
  const res = address.getSequence('');
  await expect(res).rejects.toThrow('No set address');
});

// todo: faucet
//curl https://faucet.altnet.rippletest.net/accounts -X POST
 
