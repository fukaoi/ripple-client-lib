const config = require('config');
const Address = require('../src/lib/address')


let address;

afterEach(() => {
  console.log('## Call after method. ##');
  address.disconnect();
});

test('Generate new address', async () => {
  address = new Address();
  const created = await address.newAddress();
  expect(created.secret).not.toBeUndefined();
  expect(created.address).not.toBeUndefined();
});


test('Get seq number', async () => {
  address = new Address();
  const created = address.newAddress();
  console.log(created);
  // address.getSequence(created.address);
});

test('No set param', () => {
  expect(() => {
    new Client().getSequence('');
  }).toThrow();
});

 
