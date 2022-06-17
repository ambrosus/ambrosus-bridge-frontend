import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import useCoinBalance from './useCoinBalance';
import { ambChainId } from '../utils/providers';
import getFee from '../utils/getFee';

const useGetMaxTxAmount = (selectedCoin) => {
  const { chainId } = useWeb3React();
  const balance = useCoinBalance(selectedCoin.symbol, selectedCoin.chainId);

  return async () => {
    // TODO: refactor this
    let max;
    if (selectedCoin.nativeAnalog) {
      max = utils.formatUnits(balance, selectedCoin.denomination);
    }
    if (selectedCoin.wrappedAnalog) {
      const bnBalance = BigNumber.from(balance);

      const { amount } = await getFee(
        chainId === ambChainId,
        utils.formatUnits(bnBalance, selectedCoin.denomination),
        selectedCoin,
        true,
      ).catch((error) => {
        throw error;
      });

      if (amount.lt('0')) return '0';

      // TODO: move formatting to stnadalone function
      const [intPart, floatPart] = utils
        .formatUnits(amount.toString(), selectedCoin.denomination)
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
