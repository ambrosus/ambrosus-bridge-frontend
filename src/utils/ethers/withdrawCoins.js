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

  let res;
  try {
    res = await BridgeContract.withdraw(
      selectedCoin.address,
      account,
      bnTransactionAmount,
      !!receivedCoin.wrappedAnalog, // true
      { value: transferFee, ...gasOpts },
    );
    await res.wait();
  } catch (e) {
    // amb (WETH) to eth (ETH)
    res = await BridgeContract.callStatic.withdraw(
      selectedCoin.address, // WETH in amb
      account,
      bnTransactionAmount,
      !!receivedCoin.wrappedAnalog, // true
      { value: transferFee, ...gasOpts },
    );
  }

  return res;
};

export default withdrawCoins;
