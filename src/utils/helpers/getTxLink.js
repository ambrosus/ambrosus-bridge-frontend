import { allNetworks } from '../networks';

const getTxLink = (chainId, hash) => {
  const explorerLink = Object.values(allNetworks).find(
    (el) => el.chainId === chainId,
  );
  return explorerLink ? `${explorerLink.explorerUrl}tx/${hash}` : null;
};

export default getTxLink;
