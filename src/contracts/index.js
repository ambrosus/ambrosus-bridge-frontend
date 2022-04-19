import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0x32fac62b1196E03Ed3644a40DbFbe5728e31599A';
export const ethContractAddress = '0xf9427deDdAa899d388db70c0Fb4dA84A06976C85';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export const bridgeContractAddress = {
  [ambChainId]: ambContractAddress,
  [ethChainId]: ethContractAddress,
};

export default createBridgeContract;
