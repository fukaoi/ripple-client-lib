const config = require('config');
const exec = require('child_process').exec;

process.env.SERVER = config.get('server');
process.env.SIGNER_ENTRIES = config.get('signer_entries');
process.env.MASTER_KEY = config.get('master_key');
process.env.QUORUM = config.get('quorum')

exec(`node ${process.argv[2]}`, function(err, stdout, stderr){
  console.log(stdout);
  console.error(stderr);
});


