import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0x52Ad187140b725dfFb49FF3f1f62A9650ab8aCB1';
export const ethContractAddress = '0x2c7016a40E24BC83f791866fE82c78f0f599f2C5';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
