const config = require('config');
const Client = require('../src/lib/client')


let client;

afterEach(() => {
  console.log('## Call after method. ##');
  client.disconnect();
});

test('Client connect', async () => {
  const srv = config.get('server');
  client = new Client(srv);
  const connected = await client.connect();
  expect(connected).toBeTruthy();
});

test('Client connect no constructor param', async () => {
  client = new Client();
  const connected = await client.connect();
  expect(connected).toBeTruthy();
});

function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}
 
