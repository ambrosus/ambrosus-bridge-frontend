import { BigNumber, utils } from 'ethers';
import { ambChainId } from '../providers';

const withdrawWrappedCoins = async (
  transactionAmount,
  selectedCoin,
  transferFee,
  account,
  chainId,
  BridgeContract,
) => {
  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );
  const gasOpts =
    chainId === ambChainId ? { gasLimit: 8000000, gasPrice: 1 } : {};

  if (selectedCoin.isNativeCoin) {
    return BridgeContract.wrap_withdraw(account, {
      value: bnTransactionAmount.add(transferFee),
      ...gasOpts,
    });
  }

  return BridgeContract.withdraw(
    selectedCoin.addresses[chainId],
    account,
    bnTransactionAmount,
    { value: transferFee, ...gasOpts },
  );
};

export default withdrawWrappedCoins;
