const RippleAPI = require('ripple-lib').RippleAPI;


class GenerateAddress {
  constructor(srv) {
    this.api = new RippleAPI({server: srv});
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
      this.api.disconnect();
    }
  }
}

const server = process.env.SERVER;
new GenerateAddress(server).main();


