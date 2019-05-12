const Multisig = require("../src/multisig");
const RippleAPI = require("ripple-lib").RippleAPI;
const SERVER = 'wss://s.altnet.rippletest.net:51233';

async function main(masterKey, quorum, fee, signerLists, regularKeys) {
  const api = new RippleAPI({server: SERVER});
  try {
    await api.connect();
    const m = new Multisig(api);
    const entries = m.createSignerList(signerLists);
    const txjson = await m.setupMultisig(masterKey.address, entries, quorum, fee);
    const res = await m.broadCast(txjson, masterKey.secret);
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await api.disconnect();
  }
}

const masterKey = 
{
  address: "raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp",
  secret: "ssBKGd1TqzG1G1MrVMEw262ao98Sq"
};

const signerLists = 
[
  {
    address:"rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS",
    weight:1
  },
  {
    address:"rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK",
    weight:1
  },
  {
    address:"rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6",
    weight:1
  }
];
  
const regularKeys =  
[
  { 
    address:"rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS",
    secret: "ssJaD4Gq2JucUJwjQm8cRafkTvVos"
  },
  {
    address: "rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK",
    secret: "sskWD5YudzgV8c2PLMnEiTVWZfWty"
  },
  {
    address: "rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6",
    secret: "spzAGSGjHVqLrbseewsivtG1ah8GP"
  }
];

const quorum = 3;
const fee = 30;
main(masterKey, quorum, fee, signerLists, regularKeys);
