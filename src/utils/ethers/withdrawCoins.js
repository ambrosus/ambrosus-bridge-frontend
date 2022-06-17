import { BigNumber, ethers, utils } from 'ethers';
import { ambChainId } from '../providers';
import createBridgeContract, { bridgeContractAddress } from '../../contracts';

const approveAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
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
  account,
  chainId,
  signer,
) => {
  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );

  const { bridgeFee, transferFee, signature } = await fetch(
    'https://relay-eth.ambrosus-dev.io/fees',
    {
      method: 'POST',
      body: JSON.stringify({
        isAmb: chainId === ambChainId,
        amount: utils.hexValue(bnTransactionAmount),
        ...(selectedCoin ? { tokenAddress: selectedCoin.address } : {}),
      }),
    },
  ).then((res) => res.json());

  const gasOpts =
    chainId === ambChainId ? { gasLimit: 8000000, gasPrice: 1 } : {};

  const BridgeContract = createBridgeContract[chainId](signer);

  // if native coin
  if (selectedCoin.wrappedAnalog) {
    return BridgeContract.wrapWithdraw(
      account,
      signature,
      transferFee,
      bridgeFee,
      {
        value: bnTransactionAmount.add(transferFee).add(bridgeFee),
        ...gasOpts,
      },
    );
  }

  // if wrapped coin

  const TokenContract = new ethers.Contract(
    selectedCoin.address,
    approveAbi,
    signer,
  );

  const allowance = await TokenContract.allowance(
    account,
    bridgeContractAddress[chainId],
  );

  if (
    allowance.lt(bnTransactionAmount) &&
    bnTransactionAmount.lt('100000000000000000000000')
  ) {
    await TokenContract.approve(
      bridgeContractAddress[chainId],
      BigNumber.from('100000000000000000000000'),
    )
      .then((tx) => tx.wait())
      .catch((e) => {
        throw e;
      });
  }

  if (
    allowance.lt(bnTransactionAmount) &&
    bnTransactionAmount.gt('100000000000000000000000')
  ) {
    await TokenContract.approve(
      bridgeContractAddress[chainId],
      bnTransactionAmount,
    ).then((tx) => tx.wait());
  }

  return BridgeContract.withdraw(
    selectedCoin.address,
    account,
    bnTransactionAmount,
    !!receivedCoin.wrappedAnalog,
    signature,
    transferFee,
    bridgeFee,
    { value: BigNumber.from(transferFee).add(bridgeFee), ...gasOpts },
  );
};

export default withdrawCoins;
