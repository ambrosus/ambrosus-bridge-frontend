import { allNetworks } from '../networks';

const { eth, amb } = allNetworks;

const getTxLink = (isEth, hash) =>
  `${isEth ? eth.explorerUrl : amb.explorerUrl}tx/${hash}`;

export default getTxLink;
