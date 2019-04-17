'use strict';

const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233'
});

api.connect().then(() => {
  const myAddress = 'rsxSWHhd1MhstE8BPihxfZinj5WsnmLtPa';
  console.log('getting account info for', myAddress);
  return api.getAccountInfo(myAddress);
}).then(info => {
  console.log(info)
  console.log('getAccountInfo done')
}).then(() =>{
  return api.disconnect()
}).then(() => {
  console.log('done and disconnected')
}).catch(console.error)
