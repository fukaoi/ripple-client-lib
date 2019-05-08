const Address = require('../src/lib/address');

const Define = {
  sleep: (waitMsec) => {
    let startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  },

  address: async () => {
    const address = new Address();
    const res = JSON.parse(await address.generateFaucet()); 
    Define.sleep(5000); 
    return res.account.address;
  }
};

module.exports = Define;

jest.setTimeout(60000); // jest timeout 60sec
