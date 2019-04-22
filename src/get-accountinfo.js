'use strict';

const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
  server: 'wss://s2.ripple.com:443'
});

const myAddress = 'rJumr5e1HwiuV543H7bqixhtFreChWTaHH';

const main = async () => {
  await api.connect();
  const info = await  api.getAccountInfo(myAddress);
  console.log(info.xrpBalance);
  return info.xrpBalance;
}

const info = main()
console.log(info);

