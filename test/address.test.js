require("./define");
const Address = require("../src/lib/address");
const RippleAPI = require("ripple-lib").RippleAPI;

const SERVER = "wss://s.altnet.rippletest.net:51233";
const api = new RippleAPI({ server: SERVER });
const a = new Address(api);

beforeAll(async () => {
  await api.connect();
});

afterAll(async () => {
  await api.disconnect();
});

test("Generate new address", async () => {
  const res = await a.newAccount();
  expect(res.secret).not.toBeUndefined();
  expect(res.address).not.toBeUndefined();
});

test("Generate new ddress with faucet", async () => {
  const res = await a.newAccountTestnet();
  expect(res.secret).not.toBeUndefined();
  expect(res.address).not.toBeUndefined();
});

test("Get seq number", async () => {
  const res = await a.newAccountTestnet();
  // Until complete when created account in rippled network
  a.setInterval(5000);
  const seq = await a.getSequence(res.address);
  await expect(seq).toBeGreaterThan(0);
});

test("Set invalid param getSequence()", async () => {
  await expect(a.getSequence(0)).rejects.toThrow(Error);
  await expect(a.getSequence("")).rejects.toThrow(Error);
  await expect(a.getSequence("")).rejects.toThrow(Error);
  await expect(a.getSequence(null)).rejects.toThrow(Error);
  await expect(a.getSequence(undefined)).rejects.toThrow(Error);
});

test("Is validate ripple address", async () => {
  const address = 'rBshkANjvVbBBHwJZK74ZMv5LEnUuuxZKc';
  const res = a.isValidAddress(address);
  await expect(res).toBe(true);
});

test("Error validate ripple address", async () => {
  const address = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const res = a.isValidAddress(address);
  await expect(res).toBe(false);
});

test("Is validate ripple secret", async () => {
  const secret = 'ssJaD4Gq2JucUJwjQm8cRafkTvVos';
  const res = a.isValidSecret(secret);
  await expect(res).toBe(true);
});

test("Error validate ripple secret", async () => {
  const secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const res = a.isValidSecret(secret);
  await expect(res).toBe(false);
});


