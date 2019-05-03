const config = require('config');
const Api = require('../src/lib/api')

let api;

test('api connect', async () => {
  const srv = config.get('server');
  api = new Api(srv);
  const connected = await api.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

test('api connect no constructor param', async () => {
  api = new Api();
  const connected = await api.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}
 
