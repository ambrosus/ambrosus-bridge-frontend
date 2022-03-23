import NetworkMock from './networks.mock.json';

export const getSupportedNetworks = () =>
  process.env.REACT_APP_ENV === 'production'
    ? {
        // ...
        // some fetching stuff
        // ...
      }
    : NetworkMock;

export const AmbrosusNetwork =
  process.env.REACT_APP_ENV === 'production'
    ? {
        name: 'Ambrosus',
        code: 'AMB',
        chainId: 16718,
        rpcUrl: 'https://network.ambrosus.io',
      }
    : {
        name: 'Ambrosus Devnet',
        code: 'AMB',
        chainId: 30741,
        rpcUrl: 'https://network.ambrosus-dev.io',
      };
