const Address = require('lib/address')

async function main(network) {
  try {
    const a = new Address();
    let account = {};
    if (network == 'testnet') {
      account = JSON.parse(await a.generateFaucet()); 
      console.log(JSON.stringify(account.account))
    } else {
      account = await a.newAddress();
      console.log(JSON.stringify(account));
    }
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

const network = process.env.NETWORK;

main(network);

