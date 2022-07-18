import { BigNumber, utils } from 'ethers';
import { bscChainId, ethChainId } from './providers';

const getFee = (
  isFromAmb,
  transactionAmount,
  selectedCoin,
  foreignChainId,
  isAmountWithFees = false,
) =>
  fetch(relayUrlByChainId[foreignChainId], {
    method: 'POST',
    body: JSON.stringify({
      isAmb: isFromAmb,
      amount: utils.hexValue(
        utils.parseUnits(
          transactionAmount || '0.001',
          selectedCoin.denomination,
        ),
      ),
      ...(selectedCoin ? { tokenAddress: selectedCoin.address } : {}),
      isAmountWithFees,
    }),
  })
    .then((res) => res.json())
    .then(({ bridgeFee, transferFee, signature, amount, message }) => {
      if (message) throw new Error(message);
      const bnBridgeFee = BigNumber.from(bridgeFee);
      const bnTransferFee = BigNumber.from(transferFee);
      return {
        totalFee: bnBridgeFee.add(bnTransferFee).toString(),
        bridgeFee: bnBridgeFee,
        transferFee: bnTransferFee,
        amount: BigNumber.from(amount),
        signature,
      };
    });

const relayUrlByChainId = {
  [bscChainId]: 'https://relay-bsc.ambrosus-dev.io/fees',
  [ethChainId]: 'https://relay-eth.ambrosus-dev.io/fees',
};

export default getFee;
