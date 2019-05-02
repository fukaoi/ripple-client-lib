const RippleAPI = require('ripple-lib').RippleAPI;

module.exports = class Api {
  constructor(srv) {
    this.api = new RippleAPI({server: srv});
  }

  async connect() {
    try {
      await this.api.connect();
      return true;
    } catch(e) {
      console.error(e);
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



