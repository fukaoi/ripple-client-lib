const config = require('config');
const Client = require('../src/lib/client')


let client;

afterEach(async () => {
  await client.disconnect();
});

test('Client connect', async () => {
  const srv = config.get('server');
  client = new Client(srv);
  const connected = await client.connect();
});

test('Client connect no constructor param', async () => {
  client = new Client();
  const connected = await client.connect();
});

 
