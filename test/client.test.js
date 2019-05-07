const config = require('config');
const Client = require('../src/client')

afterEach(async () => {
  const api = Client.instance;
  await api.disconnect();
});

test('Client connect', async () => {
  const srv = config.get('server');
  Client.instance = srv;
  const api = Client.instance;
  const connected = await api.connect();
});

test('Client connect no constructor param', async () => {
  const api = Client.instance;
  const connected = await api.connect();
});

 
