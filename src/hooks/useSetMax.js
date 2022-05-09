import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import useCoinBalance from './useCoinBalance';
import createBridgeContract from '../contracts';
import { ambChainId } from '../utils/providers';

const useGetMaxTxAmount = (selectedCoin, transactionAmount) => {
  const { account, chainId, library } = useWeb3React();
  const balance = useCoinBalance(selectedCoin.symbol, selectedCoin.chainId);

  return async () => {
    let max;
    if (selectedCoin.nativeAnalog) {
      max = balance;
    }
    if (selectedCoin.wrappedAnalog) {
      const bnTransactionAmount = BigNumber.from(
        utils.parseUnits(transactionAmount || '1.0', selectedCoin.denomination),
      );
      const bnBalance = BigNumber.from(balance);

      const BridgeContract = createBridgeContract[chainId](library.getSigner());
      const fee = await BridgeContract.callStatic.fee();

      const gasOpts =
        chainId === ambChainId ? { gasLimit: 8000000, gasPrice: 1 } : {};

      const estGasPrice = await BridgeContract.estimateGas.wrapWithdraw(
        account,
        {
          value: bnTransactionAmount.add(fee),
          ...gasOpts,
        },
      );

      max = bnBalance.sub(fee).sub(estGasPrice).toString();
    }

    return utils.formatUnits(max, selectedCoin.denomination);
  };
};

export default useGetMaxTxAmount;
