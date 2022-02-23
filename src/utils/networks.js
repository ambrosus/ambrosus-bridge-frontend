import NetworkMock from './networks.mock.json';

export const getSupportedNetworks = () =>
  process.env.NODE_ENV === 'production'
    ? {
        // ...
        // some fetching stuff
        // ...
      }
    : NetworkMock;

export const AmbrosusNetwork =
  process.env.NODE_ENV === 'production'
    ? {
        name: 'Ambrosus',
        chainId: 16718,
      }
    : {
        name: 'Ambrosus Testnet',
        chainId: 22035,
      };
