const RippleAPI = require('ripple-lib').RippleAPI;

let api;
async function connect() {
  api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})  
  await api.connect()
}

async function main() {
  await connect()
  const address = api.generateAddress()
  console.log(address)
}

main().then(res => {
  console.log('## Success ##');
  console.log(res);
  api.disconnect();
}).catch(error => {
  console.log('## Error ##');
  console.error(error);
  api.disconnect();
});


