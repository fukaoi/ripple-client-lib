const RippleAPI = require('ripple-lib').RippleAPI;

let api;
async function connect() {
  api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})  
  await api.connect()
}

const masterAddress = {
  address: 'raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp',
  secret: 'ssBKGd1TqzG1G1MrVMEw262ao98Sq',
  sequence: async (addr) => {
    const info = await api.getAccountInfo(addr)
    return info.sequence
  }
}

const signerAddresses = [
  {
    address: 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS',
    secret: 'ssJaD4Gq2JucUJwjQm8cRafkTvVos'
  },
  {
    address: 'rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK',
    secret: 'sskWD5YudzgV8c2PLMnEiTVWZfWty'
  },
  {
    address: 'rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6',
    secret: 'spzAGSGjHVqLrbseewsivtG1ah8GP'
  }
]

const signerEntries = [
  {
    'SignerEntry': {
      'Account': 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS',
      'SignerWeight': 1
    }
    
  },
  {
    'SignerEntry': {
      'Account': 'rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK',
      'SignerWeight': 1
    }
    
  },
  {
    'SignerEntry': {
      'Account': 'rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6',
      'SignerWeight': 1
    }
    
  },
]

// fee test
// fee=12...succes 
// fee=5....succes  
// fee=1....succes  
// fee=0....succes  
// Delete Fee colum....Big Number error

const fee = '0'
const setupMultisig = async (multiSignAddress, signers, quorum) => {
  const txJson = {
    'Flags': 0,
    'TransactionType': 'SignerListSet',
    'Account': multiSignAddress.address,
    'Sequence': await multiSignAddress.sequence(multiSignAddress.address),
    'Fee': fee,
    'SignerQuorum': quorum,
    'SignerEntries': signers
  }    
  return txJson;
}

async function main() {
  await connect()
  const txJson = await setupMultisig(masterAddress, signerEntries, 2)
  const signedTx = await api.sign(JSON.stringify(txJson), masterAddress.secret)
  console.log("signedTx:\n", signedTx)
  const receipt = await api.submit(signedTx.signedTransaction)
  console.log("receipt\n", receipt)
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

