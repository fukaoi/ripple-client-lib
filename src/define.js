const config = require('config');
const exec = require('child_process').exec;

process.env.SERVER = config.get('server');
exec(`node ${process.argv[2]}`, function(err, stdout, stderr){
  console.log(stdout);
  console.error(stderr);
});


