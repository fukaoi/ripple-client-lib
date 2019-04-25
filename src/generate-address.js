const RippleAPI = require('ripple-lib').RippleAPI;
const config = require('config');


class GenerateAddress {
  constructor() {
    this.api = new RippleAPI({server: config.get('server')});
  } 

  async connect() {
    await this.api.connect();
  }

  async main() {
    try {
      await this.connect();
      const address = await this.api.generateAddress();
      console.log(address);
    } catch(e) {
      console.error(e)
    } finally {
      console.log('finalize');
      this.api.disconnect();
    }
  }
}

new GenerateAddress().main();


