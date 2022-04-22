import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0xdD97591Fd05f082d363CCe6e793b778cbC728085';
export const ethContractAddress = '0xda8816F19a252AF8A68062Eebe266A278C399a93';

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
