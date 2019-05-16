const exec = require("child_process").exec;

process.env.SERVER = 'wss://s.altnet.rippletest.net:51233';
process.env.IS_TESTNET = 'true';
process.env.MASTER_KEY = JSON.stringify({
  address: "raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp",
  secret: "ssBKGd1TqzG1G1MrVMEw262ao98Sq"
});

process.env.SIGNER_LISTS = JSON.stringify([
  {
    address: "rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS",
    weight: 1
  },
  {
    address: "rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK",
    weight: 1
  },
  {
    address: "rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6",
    weight: 1
  }
]);

process.env.REGULAR_KEYS = JSON.stringify([
  {
    address: "rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS",
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
]);


process.env.TO_ADDRESS = "rsGPNkSLt36BDLMgPAYKifFvCphQJZ2qJw";

const quorum = 3;
process.env.QUORUM = quorum;
process.env.FEE = 10 * quorum;      //10dropx => 0.00001xrp
process.env.AMOUNT = 100;
process.env.PAYMENT_FEE = 0.00001; //0.00001xrp => 10drops
process.env.TAGS = JSON.stringify({source: 8, destination: 1024});
process.env.MEMOS = JSON.stringify([]);

// const memos = [
  // {
    // type: "payment test",
    // format: "text/plain",
    // data: "SendPaymentByMultisig"
  // }
// ];


exec(`NODE_PATH=./src node ${process.argv[2]}`, function(err, stdout, stderr) {
  console.log(stdout);
  console.error(stderr);
});
