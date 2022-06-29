import providers from '../providers';
import createBridgeContractById from '../../contracts';

const getTxLastStageStatus = async (otherNetId, eventId) => {
  const otherProvider = providers[otherNetId];

  const otherNetworkContract =
    createBridgeContractById[otherNetId](otherProvider);

  const otherNetworkFilter = await otherNetworkContract.filters.TransferFinish(
    eventId,
  );
  const otherNetworkEvent = await otherNetworkContract.queryFilter(
    otherNetworkFilter,
  );
  return otherNetworkEvent;
};

export default getTxLastStageStatus;
