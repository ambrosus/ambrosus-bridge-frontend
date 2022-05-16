import { BigNumber, utils } from 'ethers';

const formatBalance = (balance, denomination) => {
  const balanceFloatString = utils.formatUnits(
    BigNumber.from(balance),
    denomination,
  );

  const [intPart, floatPart] = balanceFloatString.split('.');
  let formattedBalance;
  if (floatPart && floatPart.length > 3) {
    formattedBalance = `${intPart}.${floatPart.slice(0, 3)}`;
  } else if (floatPart) {
    formattedBalance = `${intPart}.${floatPart}`;
  } else {
    formattedBalance = intPart;
  }
  return formattedBalance;
};

export default formatBalance;
