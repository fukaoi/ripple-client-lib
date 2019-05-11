const RippleAPI = require("ripple-lib").RippleAPI;

const TEST_SERVER = "wss://s.altnet.rippletest.net:51233";
const SERVER = "wss://s2.ripple.com:51234";


// singleton object
class Client {
  constructor(network = "testnet") {
    let srv;
    if (network == "livenet") {
      srv = SERVER;
    } else {
      srv = TEST_SERVER;
    }
    this._api = new RippleAPI({ server: srv });
  }

  get instance() {
    return this._api;
  }

  set instance(srv) {
    this._api = new RippleAPI({ server: srv });
  }
}

const instance = new Client();
module.exports = instance;
