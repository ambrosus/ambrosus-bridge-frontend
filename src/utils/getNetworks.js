const getNetworks = () => [
  {
    name: 'Ethereum',
    rpcUrls: '',
    chainId: 1,
    coins: [],
  },
  {
    name: 'Ambrosus',
    rpcUrls: ['https://network.ambrosus.io'],
    chainId: 16718,
    coins: [],
  },
  {
    name: 'Binance Smart Chain',
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed4.defibit.io/',
    ],
    chainId: 56,
    coins: [],
  },
];

export default getNetworks;
