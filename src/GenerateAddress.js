const Address = require("lib/address");
const RippleAPI = require("ripple-lib").RippleAPI;

async function main(server, isTestnet) {
  try {
    const api = new RippleAPI({ server: server });
    const a = new Address(api);
    let account = {};
    if (isTestnet) {
      console.log("[TESTNET ACCOUNT]");
      account = await a.newAccountTestnet();
    } else {
      console.log("[MAINNET ACCOUNT]");
      account = await a.newAccount();
    }
    console.log(JSON.stringify(account));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const server = process.env.SERVER;
const isTestnet = process.env.IS_TESTNET;
main(server, isTestnet);
