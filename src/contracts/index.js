import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0x3bE8831061698833AD8a6b590A66dfA8577d4fe9';
export const ethContractAddress = '0x442594A89F37318E5F6952C4dB83201c8029A43f';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
