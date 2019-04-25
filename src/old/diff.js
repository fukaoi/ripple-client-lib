const RippleAPI = require('ripple-lib').RippleAPI;

const master = 
{
  address: 'raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp',
  secret: 'ssBKGd1TqzG1G1MrVMEw262ao98Sq',
}

let api;
async function connect() {
  api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})  
  await api.connect()
}

async function getSequence(addr) {
  const account = await api.getAccountInfo(addr);
  return account.sequence
}

async function getLedgerVersion() {
  return await api.getLedgerVersion();
}

async function main() {
  await connect()
  const vs = await getSequence(master.address)
  const ld = await getLedgerVersion()
  console.log("### sequence:", vs)
  console.log("### ledger version:", ld)
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

