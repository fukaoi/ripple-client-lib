const RippleAPI = require('ripple-lib').RippleAPI;

(async () => {
  const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233' // Public rippled server
  })
  await api.connect()

  const withdrawingUser = {
    Address: "rsGPNkSLt36BDLMgPAYKifFvCphQJZ2qJw"
  }

  const signerAddresses = [
    {
      address: 'rE4tPhwXD9PQJ1pZFrCbJphTfVKwq5aTwS',
      secret: 'ssJaD4Gq2JucUJwjQm8cRafkTvVos'
    },
    {
      address: 'rLbTw2MioZ4spnjvQr1vTRDHaURSxtJGFK',
      secret: 'sskWD5YudzgV8c2PLMnEiTVWZfWty'
    },
    {
      address: 'rfQcZ4ia3HxFzr7m8wibceXvHBfRr94iU6',
      secret: 'spzAGSGjHVqLrbseewsivtG1ah8GP'
    }
  ]

  const multiSignAddress = {
    Address: "raNMGRcQ7McWzXYL7LisGDPH5D5Qrtoprp",
  }

  const multisigSequence = (await api.getAccountInfo(multiSignAddress.Address)).sequence
  const txJson = {
    source: {
      address: multiSignAddress.Address,
      amount: {value: "1000000000", currency: 'drops'}
    },
    destination: {
      address: withdrawingUser.Address,
      minAmount: {
        value: '' + "1000000000",
        currency: 'drops'
      }
    }
  }

  //Fee 
  // quorum:1  12 * (1 + 1) => 24 // demerit single transaction
  // quorum:3  12 * (1 + 3) => 48
  // quorum:3  12 * (1 + 3) => 48
  // quorum:1 にしても、combine数に影響してしまうので、combinedを変更すべき

  const payment  = await api.preparePayment(
    multiSignAddress.Address,
    txJson,
    {
      sequence: multisigSequence,
      signersCount: 2
    })
  const sig1 = api.sign(
    payment.txJSON,
    signerAddresses[0].secret,
    {signAs: signerAddresses[0].address}
  )
  const sig2 = api.sign(
    payment.txJSON,
    signerAddresses[1].secret,
    {signAs: signerAddresses[1].address}
  )
  const sig3 = api.sign(
    payment.txJSON,
    signerAddresses[2].secret,
    {signAs: signerAddresses[2].address}
  )
  const combinedTx = api.combine([sig1.signedTransaction, sig2.signedTransaction])
  const receipt  = await api.submit(combinedTx.signedTransaction)
  console.log(receipt)
})()
