const RippleAPI = require('ripple-lib').RippleAPI;

module exports = class Connect {
  constructor(srv) {
    this.api = new RippleAPI({server: srv});
  }

  async connect() {
    await this.api.connect();
  }

  async disconnect() {
    await this.api.disconnect();
  }
}

const srv = process.env.SERVER;




