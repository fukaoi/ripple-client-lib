const Define = {
  createSigners: async a => {
    let signers = [];
    const count = 3;
    const weight = 1;
    for (let i = 0; i < count; i++) {
      let account = await a.newAccountTestnet();
      let signer = {
        address: account.address,
        weight: weight
      };
      signers.push(signer);
    }
    return signers;
  },

  createRegularKeys: async a => {
    const count = 3;
    let regulars = [];
    for (let i = 0; i < count; i++) {
      regulars.push(await a.newAccount());
    }
    return regulars;
  }
};

module.exports = Define;

jest.setTimeout(60000); // jest timeout 60sec
