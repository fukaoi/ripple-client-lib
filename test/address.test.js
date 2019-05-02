const config = require('config');
const Address = require('../src/lib/address')

let address;

afterAll(() => {
  // api.disconnect();  
});

test('api connect', async () => {
  const srv = config.get('server');
  address = new Address();
  // const connected = await api.connect();
  // expect(connected).toBeTruthy();
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
 
