import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import useCoinBalance from './useCoinBalance';
import createBridgeContract from '../contracts';
import { ambChainId } from '../utils/providers';

const useGetMaxTxAmount = (selectedCoin) => {
  const { account, chainId, library } = useWeb3React();
  const balance = useCoinBalance(selectedCoin.symbol, selectedCoin.chainId);

  return async () => {
    let max;
    if (selectedCoin.nativeAnalog) {
      max = utils.formatUnits(balance, selectedCoin.denomination);
    }
    if (selectedCoin.wrappedAnalog) {
      const bnTransactionAmount = BigNumber.from(balance);
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

      const [intPart, floatPart] = utils
        .formatUnits(
          bnBalance.sub(fee).sub(estGasPrice).toString(),
          selectedCoin.denomination,
        )
        .split('.');
      if (floatPart && floatPart.length > 8) {
        max = `${intPart}.${floatPart.slice(0, 8)}`;
      } else if (floatPart) {
        max = `${intPart}.${floatPart}`;
      } else {
        max = intPart;
      }
    }

    return max;
  };
};

export default useGetMaxTxAmount;
