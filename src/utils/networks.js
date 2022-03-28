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
        logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
        rpcUrl: 'https://network.ambrosus.io',
      }
    : {
        name: 'Ambrosus Devnet',
        code: 'AMB',
        chainId: 30741,
        logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
        rpcUrl: 'https://network.ambrosus-dev.io',
      };

export const getAllNetworks = () => {
  const supportedNetworks = getSupportedNetworks();
  return [AmbrosusNetwork, ...supportedNetworks];
};

export const getNetworkByChainId = (chainId) => {
  const networks = getAllNetworks();
  return networks.find((network) => network.chainId === chainId);
};

export const getAllChainIds = () => {
  const networks = getAllNetworks();
  return networks.map((network) => network.chainId);
};
