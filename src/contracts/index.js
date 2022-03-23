import { ethers } from 'ethers';

import ambBridgeABI from './AmbBridge.json';
import ethBridgeABI from './EthBridge.json';
import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0xd390d1bFd4AAeCd1635da5dDa419d388a7CF8766';
export const ethContractAddress = '0x3bc9473700bfECba201915e09207D42Af4CF0B63';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ambBridgeABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ethBridgeABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
