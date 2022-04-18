const getTxLink = (isEth, hash) =>
  `${
    isEth
      ? 'https://ropsten.etherscan.io/tx/'
      : 'https://explorer.ambrosus.io/tx/'
  }${hash}`;

export default getTxLink;
