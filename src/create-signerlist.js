const RippleAPI = require('ripple-lib').RippleAPI;


class CreateSignerList {
  constructor(srv, master_key, signer_entries) {
    this.api = new RippleAPI({server: srv});
  }

  async connect() {
    await this.api.connect();
  }

  async getSequenc(address) {
    return await this.api.getAccountInfo(address)
  }
}


const fee = '10'
const setupMultisig = async (multiSignAddress, signers, quorum) => {
  const txJson = {
    'Flags': 0,
    'TransactionType': 'SignerListSet',
    'Account': multiSignAddress.address,
    'Sequence': await multiSignAddress.sequence(multiSignAddress.address),
    'Fee': fee,
    'SignerQuorum': quorum,
    'SignerEntries': signers,
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

