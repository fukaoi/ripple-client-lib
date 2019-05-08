const config = require('config');
const exec = require('child_process').exec;

process.env.NETWORK = config.get('network');
process.env.SIGNER_ENTRIES = JSON.stringify(config.get('signer_entries'));
process.env.REGULAR_KEYS = JSON.stringify(config.get('regular_keys'));
process.env.MASTER_KEY = JSON.stringify(config.get('master_key'));
process.env.QUORUM = config.get('quorum');
process.env.FEE = config.get('fee');
process.env.TO = config.get('to');
process.env.AMOUNT = config.get('amount');

exec(`node ${process.argv[2]}`, function(err, stdout, stderr){
  console.log(stdout);
  console.error(stderr);
});


