const getNetworks = () => [
  {
    name: 'Ethereum',
    rpcUrls: [''],
    chainId: 1,
    coins: [],
  },
  {
    name: 'Rinkeby',
    rpcUrls: '',
    chainId: 4,
    coins: [],
  },
  {
    name: 'Ambrosus',
    rpcUrls: ['https://network.ambrosus.io'],
    chainId: 22036,
    coins: [],
  },
  {
    name: 'Ambrosus dev',
    rpcUrls: ['https://network.ambrosus-dev.io'],
    chainId: 30741,
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
