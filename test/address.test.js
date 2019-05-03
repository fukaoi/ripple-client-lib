const config = require('config');
const Address = require('../src/lib/address')

let address;

afterAll(() => {
  // api.disconnect();  
});

test('Generate new address', async () => {
  address = new Address();
  console.log(address.api);
  // sleep(1000); //prevent timeout 
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
 
