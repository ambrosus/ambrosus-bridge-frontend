import { ethers } from 'ethers';

import ABI from './abi.json';
import ConfigMock from '../bridge-config.mock.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = ConfigMock.bridges.eth.amb;
export const ethContractAddress = ConfigMock.bridges.eth.side;

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
