import { BigNumber, utils } from 'ethers';
import { ambChainId } from '../providers';
import { createBridgeContract } from '../../contracts';
import getFee from '../getFee';
import increaseAllowanceIfNeeded from './increaseAllowanceIfNeeded';

const withdrawCoins = async (
  transactionAmount,
  selectedCoin,
  receivedCoin,
  account,
  chainId,
  foreignChainId,
  contractAddress,
  signer,
) => {
  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );

  const isFromAmb = chainId === ambChainId;

  const { bridgeFee, transferFee, signature } = await getFee(
    isFromAmb,
    transactionAmount,
    selectedCoin,
    foreignChainId,
    false,
  );

  const gasOpts =
    chainId === isFromAmb ? { gasLimit: 8000000, gasPrice: 1 } : {};

  const BridgeContract = createBridgeContract(contractAddress, signer);

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
  await increaseAllowanceIfNeeded(
    account,
    selectedCoin.address,
    transactionAmount,
    signer,
  );

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
