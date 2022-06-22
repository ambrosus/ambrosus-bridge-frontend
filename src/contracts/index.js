import { ethers } from 'ethers';

import ABI from './abi.json';
import ConfigMock from '../bridge-config.mock.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = ConfigMock.bridges.eth.amb;
export const ethContractAddress = ConfigMock.bridges.eth.side;

const createBridgeContract = (contract, provider) =>
  new ethers.Contract(contract, ABI, provider);

const createAmbBridgeContract = (provider) =>
  createBridgeContract(ambContractAddress, provider);

const createEthBridgeContract = (provider) =>
  createBridgeContract(ethContractAddress, provider);

const createBridgeContractById = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export const bridgeContractAddress = {
  [ambChainId]: ambContractAddress,
  [ethChainId]: ethContractAddress,
};

export default createBridgeContractById;
