const RippleAPI = require('ripple-lib').RippleAPI;

const TEST_SERVER = 'wss://s.altnet.rippletest.net:51233';
const SERVER      = 'wss://s2.ripple.com:51234';

module.exports = class Api {

  constructor(srv) {
    if (!srv) {
      if (process.env.NODE_ENV == 'production') {
        srv = SERVER;
      } else {
        srv = TEST_SERVER;   
      }
    } 
    this.api = new RippleAPI({server: srv});
  }

  async connect() {
    try {
      await this.api.connect();
      return true;
    } catch(e) {
      console.error(e);
    } finally {
      this.disconnect(); 
    }
  }

  async disconnect() {
    try {
      await this.api.disconnect();
      return true; 
    } catch(e) {
      console.error(e); 
    }
  }
}



