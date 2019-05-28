const Address = require("lib/address");
const RippleAPI = require("ripple-lib").RippleAPI;

async function main(server, isTestnet) {
  const api = new RippleAPI({ server: server });
  try {
    await api.connect();
    const a = new Address(api);
    let account = {};
    if (isTestnet == 'true') {
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
  } finally {
    await api.disconnect();
    process.exit(0);
  }
}

const server = process.env.SERVER;
const isTestnet = process.env.IS_TESTNET;
main(server, isTestnet);
