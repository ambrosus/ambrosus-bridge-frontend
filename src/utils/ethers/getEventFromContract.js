import providers, { bscChainId } from '../providers';

const getEventFromContract = async (chainId, contract, filter, fromBlock) => {
  if (chainId === bscChainId) {
    const latestBlock = await providers[bscChainId].getBlockNumber();
    return recursiveQueryFilter(contract, filter, fromBlock, latestBlock);
  }
  return contract.queryFilter(filter);
};

export default getEventFromContract;

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
    startBlock + 49999 < endBlock ? startBlock + 49999 : endBlock,
  );
  return recursiveQueryFilter(contract, filter, startBlock + 49999, endBlock, [
    ...lastResult,
    ...result,
  ]);
};