
const Define = {
  sleep: (waitMsec) => {
    let startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }
};

module.exports = Define;
