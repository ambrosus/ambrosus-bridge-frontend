import { BigNumber, utils } from 'ethers';
import { bscChainId, ethChainId } from './providers';

const { REACT_APP_ENV } = process.env;

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

const relayUrlByChainId =
  // eslint-disable-next-line no-nested-ternary
  REACT_APP_ENV === 'production'
    ? {
        [bscChainId]: `https://relay-bsc.ambrosus.io/fees`,
        [ethChainId]: `https://relay-eth.ambrosus.io/fees`,
      }
    : REACT_APP_ENV === 'devnet'
    ? {
        [bscChainId]: `https://relay-bsc.ambrosus-dev.io/fees`,
        [ethChainId]: `https://relay-eth.ambrosus-dev.io/fees`,
      }
    : {
        [bscChainId]: `https://relay-bsc.ambrosus-test.io/fees`,
        [ethChainId]: `https://relay-eth.ambrosus-test.io/fees`,
      };

export default getFee;
