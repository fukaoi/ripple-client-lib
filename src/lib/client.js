const RippleAPI = require('ripple-lib').RippleAPI;

const TEST_SERVER = 'wss://s.altnet.rippletest.net:51233';
const SERVER      = 'wss://s2.ripple.com:51234';

class Client {
  constructor() {
    let srv;
    if (process.env.NODE_ENV == 'production') {
      srv = SERVER;
    } else {
      srv = TEST_SERVER;   
    }
    this._api = new RippleAPI({server: srv});
  }

  get instance() {
    return this._api; 
  }

  set instance(srv) {
    this._api = new RippleAPI({server: srv}) 
  }
}

const instance = new Client();
module.exports = instance;
