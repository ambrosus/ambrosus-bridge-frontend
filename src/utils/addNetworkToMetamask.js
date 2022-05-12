const addNetworkToMetamask = async () => {
  if (window.ethereum) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x414E',
          chainName: 'Ambrosus',
          nativeCurrency: {
            name: 'AMB',
            symbol: 'AMB',
            decimals: 18,
          },
          rpcUrls: ['https://network.ambrosus.io'],
          blockExplorerUrls: ['https://explorer.ambrosus.io'],
        },
      ],
    });
  } else {
    window.location.href = 'https://metamask.app.link/dapp/ambrosus.io';
  }
};

export default addNetworkToMetamask;
