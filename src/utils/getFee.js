import { BigNumber, utils } from 'ethers';

const getFee = (isFromAmb, transactionAmount, selectedCoin) =>
  fetch('https://relay-eth.ambrosus-dev.io/fees', {
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
    }),
  })
    .then((res) => res.json())
    .then(({ bridgeFee, transferFee, signature }) => {
      const bnBridgeFee = BigNumber.from(bridgeFee);
      const bnTransferFee = BigNumber.from(transferFee);
      return {
        totalFee: bnBridgeFee.add(bnTransferFee).toString(),
        bridgeFee: bnBridgeFee,
        transferFee: bnTransferFee,
        signature,
      };
    });

export default getFee;
