const RippleAPI = require('ripple-lib').RippleAPI;

const master = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';   //マスターキー
const masterSecret = 'ssmx3expkpmFBhLykNTWnaYr7D1eM';

const signers = {
  treshold: 2,
  weigths: [
    {address: reg1, weigthts: 1},
    {address: reg2, weigthts: 1},
  ]
};

let api;
async function connect() {
  api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})  
  await api.connect()
}

const multiSignAddress = {
  address: '',
  secret: '',
  sequence: async(addr) => {
    const info = api.getAccountInfo(addr)
    return info.sequence
  }
}

const signerAddresses = [
  {
    address: 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS',
    secret: 'ssJaD4Gq2JucUJwjQm8cRafkTvVos'
  },
  {
    address: 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS',
    secret: 'ssJjX6xNmpMdqyifkNXNrqgfSqhuQ'
  },
  {
    address: 'rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6',
    secret: 'spzAGSGjHVqLrbseewsivtG1ah8GP'
  }
]

const setupMultisig = (multiSignAddress, signers, quorum) => {
  const txJson = {
    'Flags': 0,
    'TransactionType': 'SingnerListSet',
    'Account': multiSignAddress.address,
    'Sequence': await multiSignAddress.sequence(multiSignAddress.address),
    'Fee': '12',
    'SingnerQuorum': quorum,
    'SignerEntries': signers
  }    
}

async function main() {
  await setupMultisig(multiSignAddress, SignerEntries, 2)
}

main().then(res => {
  console.log('## Success ##');
  console.log(res);
  api.disconnect();
}).catch(error => {
  console.log('## Error ##');
  console.error(error);
  api.disconnect();
});
