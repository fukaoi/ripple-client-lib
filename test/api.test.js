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

test('api connect no constructor param', () => {
  api = await new Api();
  const connected = await api.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}
 
