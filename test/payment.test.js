const Define = require('./define');
const Payment = require('../src/lib/payment')

let payment ;

beforeAll(async () => {
  masterAddress = await Define.address();
  payment = new Payment(masterAddress);
  await payment.api.connect();
});

afterAll(async () => {
  await payment.api.disconnect();
});

test('Create source object', () => {
  const amount = 0.001;
  const tag = 123;
  const res = payment.createSouce(amount, tag);

  expect(res.source.address).toEqual(masterAddress);
  expect(res.source.amount.value).toEqual(amount);
  expect(res.source.amount.currency).toEqual('XRP');
  expect(res.source.tag).toEqual(tag);
});

test('Create destination object', async () => {
  const toAddress = await Define.address(); 
  const amount = 0.001;
  const tag = 456;
  const res = payment.createDestination(amount, toAddress, tag);

  expect(res.destination.address).toEqual(toAddress);
  expect(res.destination.minAmount.value).toEqual(amount);
  expect(res.destination.minAmount.currency).toEqual('XRP');
  expect(res.destination.tag).toEqual(tag);
});

test('Add memo and Setup transacction', () => {
  const srcObj = {source: {}};
  const destObj = {destination: {}};
  const memos = [{
    "type":   "test",
    "format": "text/plain",
    "data":   "texted data" 
  }];
  const res = payment.setupTransaction(srcObj, destObj, memos);

  expect(res.memos[0].type).toEqual('test');
  expect(res.memos[0].format).toEqual('text/plain');
  expect(res.memos[0].data).toEqual('texted data');
 });

test('Prepare payment', async () => {

  // source obj
  const amount = '0.001';
  const srcObj = payment.createSouce(amount);

  // dest obj
  const toAddress = await Define.address();
  const destObj = payment.createDestination(amount, toAddress);
  // setup transacction
  const tx = payment.setupTransaction(srcObj, destObj);
  
  // prepara obj
  const json = await payment.preparePayment(tx, 2);

  expect(json).toBeDefined();
});

