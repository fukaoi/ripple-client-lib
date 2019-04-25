async function main(){
  const myAddress = 'rJumr5e1HwiuV543H7bqixhtFreChWTaHH';
  const RippleAPI = require('ripple-lib').RippleAPI;
  const api = new RippleAPI({
    server: 'wss://s2.ripple.com:443'
  });
  await api.connect();
  return await api.getAccountInfo(myAddress);
}


main().then(accountInfo => console.log(accountInfo))
