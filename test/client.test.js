const config = require('config');
const Client = require('../src/lib/client')

test('Client connect', async () => {
  const srv = config.get('server');
  let client = new Client(srv);
  const connected = await client.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

test('Client connect no constructor param', async () => {
  let client = new Client();
  const connected = await client.connect();
  expect(connected).toBeTruthy();
  sleep(1000); //prevent timeout 
});

function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}
 
