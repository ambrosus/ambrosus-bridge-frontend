import providers, { ambChainId, ethChainId } from './providers';
import createBridgeContract from '../contracts';

const getTxLastStageStatus = async (chainId, eventId) => {
  const otherNetId = chainId === ambChainId ? ethChainId : ambChainId;
  const otherProvider = providers[otherNetId];

  const otherNetworkContract = createBridgeContract[otherNetId](otherProvider);

  const otherNetworkFilter = await otherNetworkContract.filters.Transfer(
    eventId,
  );
  const otherNetworkEvent = await otherNetworkContract.queryFilter(
    otherNetworkFilter,
  );
  return !!otherNetworkEvent.length;
};

export default getTxLastStageStatus;
