const Multisig = require('lib/multisig')

async function main(network) {
  try {
    const m = new Multisig();
  } catch(e) {
    console.log(e)
  }
}

const network = process.env.NETWORK;

main();

