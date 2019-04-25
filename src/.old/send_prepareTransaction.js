const RippleAPI = require('ripple-lib').RippleAPI;
const senderAddress = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
const senderSecret = 'ssmx3expkpmFBhLykNTWnaYr7D1eM';

async function doPrepare(api) {
  const sender = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
  const preparedTx = await api.prepareTransaction({
    'TransactionType': 'Payment',
    'Account': senderAddress, 
    'Amount': api.xrpToDrops('1'),
    'Destination': 'rMLA96QSnJi35zoTgopfWRtyyrxhcgpq1z',
  }, {
    'maxLedgerVersionOffset': 75,
    'fee': '0.000009'  // 10drops: success, 9dropbs: failed
  });
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion;
  return preparedTx.txJSON;
}

async function doSubmit(api, txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion();
  console.log('latestLedgerVersion: ', latestLedgerVersion);
  return await api.submit(txBlob)
}

async function main() {
  const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
  });
  await api.connect();
  const txJSON = await doPrepare(api);
  console.log('##### txJSON #####: ', txJSON);
  const response = api.sign(txJSON, senderSecret);
  console.log('##### response ######: ', response);
  const txBlob = response.signedTransaction
  console.log('##### Signed blob ######: ', txBlob);
  const result = await doSubmit(api, txBlob);
  console.log('##### result #####: ', result);
  api.disconnect();
}

main()
