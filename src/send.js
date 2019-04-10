const RippleAPI = require('ripple-lib').RippleAPI;


async function doPrepare(api) {
  const sender = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
  const preparedTx = await api.prepareTransaction({
    'TransactionType': 'Payment',
    'Account': sender, 
    'Amount': api.xrpToDrops('1'),
    'Destination': 'rMLA96QSnJi35zoTgopfWRtyyrxhcgpq1z'
  }, {
    'maxLedgerVersionOffset': 75 
  });
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion;
  return preparedTx.txJSON;
}


async function main() {
  const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
  });
  await api.connect();
  const txJSON = await doPrepare(api);
  console.log('txJSON: ', txJSON);
  await api.disconnect();
}

main()
