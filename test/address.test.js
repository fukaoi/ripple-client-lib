const config = require('config');
const Address = require('../src/lib/address')

test('Generate new address', async () => {
  const address = new Address();
  const created = await address.newAddress();
  console.log(created);
});

// test('No set param', () => {
  // expect(() => {
    // new Api('');
  // }).toThrow();
// });

// function sleep(waitMsec) {
  // var startMsec = new Date();
  // while (new Date() - startMsec < waitMsec);
// }
 
