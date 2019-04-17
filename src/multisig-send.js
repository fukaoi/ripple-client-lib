const RippleAPI = require('ripple-lib').RippleAPI;

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
