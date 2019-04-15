const RippleAPI = require('ripple-lib').RippleAPI;


const master = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';   //マスターキー
const masterSecret = 'ssmx3expkpmFBhLykNTWnaYr7D1eM';

const reg1 = 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS';     //レギュラーキー
const reg2 = 'rpJ3t4nqjbSaTRJ8RKMwxg5ajw8EdwnxL7';
const regSecret1 = 'ssJaD4Gq2JucUJwjQm8cRafkTvVos';
const regSecret2 = 'ssJjX6xNmpMdqyifkNXNrqgfSqhuQ';

const signers = {
  treshold: 2,
  weigths: [
    {address: reg1, weigthts: 1},
    {address: reg2, weigthts: 1},
  ]
};

async function setUp(api) {
  const instructions = {maxLedgerVersionOffset: 10};
  const multisignInstructions = Object.assign({}, instructions, {signersCount: 2});
  api.prepareSettings(master, multisignInstructions)
    .then(prepared => {
      const signed1 = api.sign(prepared.txJSON, regSecret1, {signAs: reg1});
      const signed2 = api.sign(prepared.txJSON, regSecret2, {signAs: reg2});
      const combined = api.combine([
        signed1.signedTransaction, signed2.signedTransaction
      ]);
      api.submit(combined.signedTransaction)
        .then(res => acceptLedger(api).then(() => response))
        .catch(error => {console.error(error.message)})
    })
}

async function main() {
  const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
  });
  await api.connect();
  await setUp(api);
}

main();

