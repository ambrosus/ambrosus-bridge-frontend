import { BigNumber } from 'ethers';
import { createTokenContract } from '../../contracts';

const increaseAllowanceIfNeeded = async (
  account,
  tokenAddress,
  contractAddress,
  transactionAmount,
  signer,
) => {
  const TokenContract = createTokenContract(tokenAddress, signer);
  const allowance = await TokenContract.allowance(account, contractAddress);

  if (
    allowance.lt(transactionAmount) &&
    transactionAmount.lt('100000000000000000000000')
  ) {
    await TokenContract.approve(
      contractAddress,
      BigNumber.from('100000000000000000000000'),
    )
      .then((tx) => tx.wait())
      .catch((e) => {
        throw e;
      });
  }

  if (
    allowance.lt(transactionAmount) &&
    transactionAmount.gt('100000000000000000000000')
  ) {
    await TokenContract.approve(contractAddress, transactionAmount).then((tx) =>
      tx.wait(),
    );
  }
};

export default increaseAllowanceIfNeeded;
