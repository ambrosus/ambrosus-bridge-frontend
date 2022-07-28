import { bscChainId, bscProvider } from '../providers';

const {
  REACT_APP_BSC_FROM_BLOCK: contractDeployBlock,
  REACT_APP_BSC_LOGS_LIMIT: limit,
} = process.env;

const getEventsFromContract = async (
  contract,
  filter,
  fromBlock = +contractDeployBlock,
) => {
  // eslint-disable-next-line no-underscore-dangle
  const { chainId } = contract.provider._network;
  if (chainId === bscChainId) {
    const latestBlock = await bscProvider.getBlockNumber();
    return recursiveQueryFilter(contract, filter, fromBlock, latestBlock);
  }
  return contract.queryFilter(filter);
};

export default getEventsFromContract;

const recursiveQueryFilter = async (
  contract,
  filter,
  startBlock,
  endBlock,
  lastResult = [],
) => {
  if (startBlock > endBlock) return lastResult;
  const result = await contract.queryFilter(
    filter,
    startBlock,
    startBlock + limit < endBlock ? startBlock + limit : endBlock,
  );
  return recursiveQueryFilter(contract, filter, startBlock + limit, endBlock, [
    ...lastResult,
    ...result,
  ]);
};
