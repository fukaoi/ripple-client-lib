const config = require('config');
const Address = require('../src/lib/address')
const Define = require('./define');

let address = new Address();

afterAll(async () => {
  await address.api.disconnect();
});

beforeAll(async () =>{
  await address.api.connect();  
});

test('Generate new address', async () => {
  const created = await address.newAddress();
  expect(created.secret).not.toBeUndefined();
  expect(created.address).not.toBeUndefined();
});


test('Get seq number', async () => {
  const faucetAddress = await Define.address();
  const seq = await address.getSequence(faucetAddress);
  await expect(seq).toBeGreaterThan(0);
});
