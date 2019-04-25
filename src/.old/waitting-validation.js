'use strict';

 // Mainnet pogramming

const RippleAPI = require('ripple-lib').RippleAPI;

const myAddress = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
const mySecret = 'ssmx3expkpmFBhLykNTWnaYr7D1eM';

const myOrder = {
  'direction': 'buy',
  'quantity': {
    'currency': 'F00',
    'conterparty': 'rMLA96QSnJi35zoTgopfWRtyyrxhcgpq1z',    
    'value': '100'
  },
  'totalPrice': {
    'currency': 'XRP', 
    'value': '1000'
  }
}

const INTERVAL = 1000;
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233'
});
const ledgerOffset = 5;
const myInstructions = {maxLedgerVersionOffset: ledgerOffset};

function verifyTransaction(hash, options) {
  console.log('Verifying Transaction');
  return api.getTransaction(hash, options).then(data => {
    console.log('Final Result:', data.outcome.result);
    console.log('Validated in ledger: ', data.outcome.ledgerVersion);
    console.log('Sequence: ', data.sequence);
    return data.outcome.result === 'tesSUCCESS';
  }).catch(error => {
    if (error instanceof api.errors.PendingLedgerVersionError) {
      return new Promise((resolve, reject) => {
        setTimeout(() => verifyTransaction(hash, options).then(resolve, reject), INTERVAL);
      });
    }  
    return error;
  });
}

function submitTransaction(lastClosedLedgerVersion, perpared, secret) {
  const signedData = api.sign(prepared.txJSON, secret);
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Tentative Result: ', data.resultCode);
    console.log('Tentative Message: ', data.resultMessage);
  });

  const options = {
    minLedgerVersion: lastClosedLedgerVersion,
    maxLedgerVersion: prepared.instructions.maxLedgerVersion
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => verifyTransaction(signedData.id, options).then(resolve, reject), INTERVAL);
  });
}

api.connect().then(() => {
  console.log('Connected');
  return api.prepareOrder(myAddress, myOrder, myInstructions);
}).then(prepared => {
  console.log('Order Prepared');
  return api.getLedger().then(ledger => {
    console.log('Current Ledger', ledger.ledgerVersion);
    return submitTransaction(ledger.ledgerVersion, prepared, mySecret);
  });
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected');
    process.exit();
  })
}).catch(console.error);



