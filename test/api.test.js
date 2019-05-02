const config = require('config');
const Api = require('../src/lib/api')

let api;

afterAll(() => {
  api.disconnect();  
});

test('api connect', async () => {
  const srv = config.get('server');
  api = await new Api(srv);
  const connected = await api.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

test('No set param', () => {
  expect(() => {
    new Api('');
  }).toThrow();
});

function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}
 
