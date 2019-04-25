const RippleAPI = require('ripple-lib').RippleAPI;
const senderAddress = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
const senderSecret = 'ssmx3expkpmFBhLykNTWnaYr7D1eM';

async function doPrepare(api) {
  const sender = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
  const preparedTx = await api.preparePayment(
    senderAddress,
    {
      source: {
        address: senderAddress,
        // amount: {value: "213", currency: "drops"},
        amount: {value: "1", currency: "XRP"},
      },
      destination: {
        address: "raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp",
        // minAmount: {value: '' + '213', currency: 'drops'}
        minAmount: {value: '' + '1', currency: 'XRP'}
      }
    }
  );
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
  console.log('txJSON: ', txJSON);
  const response = api.sign(txJSON, senderSecret);
  console.log('response: ', response);
  const txBlob = response.signedTransaction
  console.log('Signed blob', txBlob);
  const result = await doSubmit(api, txBlob);
  console.log('result: ', result);
  api.disconnect();
}

main()
