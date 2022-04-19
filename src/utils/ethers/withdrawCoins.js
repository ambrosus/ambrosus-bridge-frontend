import { BigNumber, ethers, utils } from 'ethers';
import { ambChainId } from '../providers';
import createBridgeContract, { bridgeContractAddress } from '../../contracts';

const increaseAllowanceAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const withdrawCoins = async (
  transactionAmount,
  selectedCoin,
  receivedCoin,
  transferFee,
  account,
  chainId,
  signer,
) => {
  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );
  const gasOpts =
    chainId === ambChainId ? { gasLimit: 8000000, gasPrice: 1 } : {};

  const BridgeContract = createBridgeContract[chainId](signer);

  // if native coin
  if (selectedCoin.wrappedAnalog) {
    return BridgeContract.wrapWithdraw(account, {
      value: bnTransactionAmount.add(transferFee),
      ...gasOpts,
    });
  }

  // if wrapped coin

  const TokenContract = new ethers.Contract(
    selectedCoin.address,
    increaseAllowanceAbi,
    signer,
  );

  await TokenContract.increaseAllowance(
    bridgeContractAddress[chainId],
    selectedCoin.address,
  ).then((res) => res.wait());

  // eth SAMB -> amb AMB
  return BridgeContract.withdraw(
    selectedCoin.address, // eth SAMB address
    account,
    bnTransactionAmount,
    !!receivedCoin.wrappedAnalog, // true
    { value: transferFee, ...gasOpts },
  );
};

export default withdrawCoins;
