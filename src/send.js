const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233'
});

api.connect();

async function doPrepare() {
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
  console.log('Prepared transaction instructions', preparedTx.txJSON)
  console.log('Transaction cost: ', preparedTx.instructions.fee, 'XRP')
  console.log('Transaction expires after ledger: ', maxLedgerVersion)
  return preparedTx.txJSON;
}

let txJSON = doPrepare();

