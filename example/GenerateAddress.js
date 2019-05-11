const Address = require("../src/address");
const RippleAPI = require("ripple-lib").RippleAPI;

async function main(network, server) {
  try {
    const api = new RippleAPI({ server: server });
    const a = new Address(api);
    let account = {};
    if (network == "testnet") {
      account = await a.newAccountTestnet();
    } else if (network == "mainnet") {
      account = await a.newAccount();
    } else {
      throw new Error(`No match network name: ${network}`);
    }
    console.log(JSON.stringify(account));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const server = "wss://s.altnet.rippletest.net:51233";
const network = "testnet";
main(network, server);
