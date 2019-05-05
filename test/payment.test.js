const Define = require('./define');
const Address = require('../src/lib/address')
const Payment = require('../src/lib/payment')

let payment;
let masterAddress;
const address = new Address();

beforeAll(async () => {
  const res = JSON.parse(await address.generateFaucet()); 
  masterAddress = res.account.address;
  Define.sleep(5000); 
});


afterEach(() => {
  payment.disconnect();
});

test('Create source object', () => {
  const amount = 0.001;
  const tag = 123;
  payment = new Payment(masterAddress);
  const res = payment.createSouce(amount, tag);
  expect(res.source.address).toEqual(masterAddress);
  expect(res.source.amount.value).toEqual(amount);
  expect(res.source.amount.currency).toEqual('XRP');
  expect(res.source.tag).toEqual(tag);
});

test('Create destination object', async () => {
  const ad = JSON.parse(await address.generateFaucet()); 
  const toAddress = ad.account.address;
  const amount = 0.001;
  const tag = 456;
  payment = new Payment(masterAddress);
  const res = payment.createDestination(amount, toAddress, tag);
  expect(res.destination.address).toEqual(toAddress);
  expect(res.destination.minAmount.value).toEqual(amount);
  expect(res.destination.minAmount.currency).toEqual('XRP');
  expect(res.destination.tag).toEqual(tag);
});

test('Add memo', () => {

});

test('Prepare payment', async () => {

});

