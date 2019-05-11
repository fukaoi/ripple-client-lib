const Define = {
  createSigners: async () => {
    let signers = [];
    const count = 3;
    const weight = 1;
    for (let i = 0; i < count; i++) {
      let signer = {
        address: await Define.address(),
        weight: weight
      };
      signers.push(signer);
    }
    return signers;
  },

  createRegularKeys: async () => {
    const address = new Address();
    const count = 3;
    let regulars = [];
    for (let i = 0; i < count; i++) {
      regulars.push(await address.newAddress());
    }
    return regulars;
  }
};

module.exports = Define;

jest.setTimeout(60000); // jest timeout 60sec
