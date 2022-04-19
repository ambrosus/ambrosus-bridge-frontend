import { BigNumber, utils } from 'ethers';
import getTokenBalance from './getTokenBalance';

const validateTransactionAmount = async (
  provider,
  tokenAddress,
  transactionAmount,
  denomination,
  ownerAddress,
) => {
  let errorMessage = '';
  const actualBnBalance = await getTokenBalance(
    provider,
    tokenAddress,
    ownerAddress,
  );

  let bnValue;
  try {
    bnValue = utils.parseUnits(transactionAmount, denomination);
  } catch (parseError) {
    errorMessage = 'Invalid value';
  }
  if (!bnValue || bnValue.isZero()) {
    errorMessage = 'Your value is zero';
  } else {
    if (bnValue.gt(actualBnBalance)) {
      errorMessage = 'Not enough coins on balance';
    }
    const minValue = BigNumber.from(utils.parseUnits('0.0001', denomination));
    if (bnValue.lt(minValue)) {
      errorMessage = 'Min value is 0,0001';
    }
  }
  return errorMessage;
};

export default validateTransactionAmount;
