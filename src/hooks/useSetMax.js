import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import useCoinBalance from './useCoinBalance';
import { ambChainId } from '../utils/providers';
import getFee from '../utils/getFee';
import { createBridgeContract } from '../contracts';
import useBridges from './useBridges';

const useGetMaxTxAmount = (selectedCoin, foreignChainId) => {
  const { chainId, account, library } = useWeb3React();
  const balance = useCoinBalance(selectedCoin.symbol, selectedCoin.chainId);
  const bridges = useBridges();

  return async () => {
    // TODO: refactor this
    let max;
    if (selectedCoin.nativeAnalog) {
      max = utils.formatUnits(balance, selectedCoin.denomination);
    }
    if (selectedCoin.wrappedAnalog) {
      const bnBalance = BigNumber.from(balance);

      const { amount, signature, transferFee, bridgeFee } = await getFee(
        chainId === ambChainId,
        utils.formatUnits(bnBalance, selectedCoin.denomination),
        selectedCoin,
        foreignChainId,
        true,
      ).catch((error) => {
        throw error;
      });

      if (amount.lt('0')) return '0';

      const gasOpts =
        chainId === ambChainId ? { gasLimit: 8000000, gasPrice: 1 } : {};

      const contractAddress =
        bridges[foreignChainId][chainId === ambChainId ? 'native' : 'foreign'];

      const BridgeContract = createBridgeContract(
        contractAddress,
        library.getSigner(),
      );

      const estGasPrice = await BridgeContract.estimateGas.wrapWithdraw(
        account,
        signature,
        transferFee,
        bridgeFee,
        {
          value: amount.add(transferFee).add(bridgeFee),
          ...gasOpts,
        },
      );

      let multipliedEstGasPrice;
      if (chainId === ambChainId) {
        multipliedEstGasPrice = estGasPrice.mul('2');
      } else {
        multipliedEstGasPrice = estGasPrice.mul('1700000000');
      }

      const finAmount = amount.sub(multipliedEstGasPrice);

      // TODO: move formatting to stnadalone function
      const [intPart, floatPart] = utils
        .formatUnits(finAmount.toString(), selectedCoin.denomination)
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
