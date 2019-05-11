const Address = require('../src/address')
const RippleAPI = require('ripple-lib').RippleAPI;

const SERVER = 'wss://s.altnet.rippletest.net:51233';
const api = new RippleAPI({server: SERVER});
const a = new Address(api);

beforeAll(async () => {
  await api.connect();
})

afterAll(async () => {
  await api.disconnect();
})

test('Generate new address', async () => {
  const res = await a.newAddress();
  expect(res.secret).not.toBeUndefined();
  expect(res.address).not.toBeUndefined();
});

test('Generate new ddress with faucet', async () => {
  const res = await a.newAddressWithFaucet();
  expect(res.secret).not.toBeUndefined();
  expect(res.address).not.toBeUndefined();
});

test('Get seq number', async () => {
  const res = await a.newAddressWithFaucet();
  const seq = await a.getSequence(res.address);
  await expect(seq).toBeGreaterThan(0);
});
