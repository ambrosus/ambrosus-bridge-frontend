import { utils } from 'ethers';
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
  if (bnValue.gt(actualBnBalance)) {
    errorMessage = 'Not enough coins on balance';
  }
  if (bnValue.isZero()) {
    errorMessage = 'Your value is zero';
  }

  return errorMessage;
};

export default validateTransactionAmount;
