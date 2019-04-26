const config = require('config');
const exec = require('child_process').exec;

process.env.SERVER = config.get('server');
process.env.SIGNER_ENTRIES = JSON.stringify(config.get('signer_entries'));
process.env.MASTER_KEY = JSON.stringify(config.get('master_key'));
process.env.QUORUM = config.get('quorum')
process.env.FEE = config.get('fee')
process.env.TO = config.get('to')

exec(`node ${process.argv[2]}`, function(err, stdout, stderr){
  console.log(stdout);
  console.error(stderr);
});


