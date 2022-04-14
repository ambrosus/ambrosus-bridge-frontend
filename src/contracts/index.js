import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0x8a493c92C560Eaa877F2a5bce8D28Fe40ca00306';
export const ethContractAddress = '0x37ab491327Cb6010416820A2BBf21618bcF08687';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
