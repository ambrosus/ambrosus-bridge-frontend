import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from '../utils/providers';

export const ambContractAddress = '0xc5bBbF47f604adFDB7980BFa6115CfdBF992413c';
export const ethContractAddress = '0x0A719de1aaEd3A4b41525fBaEf78B6E31f1BAA66';

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
