import { BigNumber } from 'ethers';
import { ambChainId } from '../providers';
import { tokens } from '../../bridge-config.mock.json';

const handleTransferredTokens = (withDrawArgs, chainId) => {
  const transTokens = { from: '', to: '' };

  if (BigNumber.from(0).eq(withDrawArgs.tokenFrom)) {
    transTokens.from = chainId === ambChainId ? 'AMB' : 'ETH';
  } else {
    transTokens.from = findTokenByAddress(withDrawArgs.tokenFrom);
  }
  if (BigNumber.from(0).eq(withDrawArgs.tokenTo)) {
    transTokens.to = chainId === ambChainId ? 'AMB' : 'ETH';
  } else {
    transTokens.to = findTokenByAddress(withDrawArgs.tokenTo);
  }
  return transTokens;
};

const findTokenByAddress = (address) => {
  let tokenName;

  Object.keys(tokens).forEach((el) => {
    Object.values(tokens[el].addresses).forEach((addr) => {
      if (addr === address) {
        tokenName = el;
      }
    });
  });
  return tokenName;
};

export default handleTransferredTokens;
