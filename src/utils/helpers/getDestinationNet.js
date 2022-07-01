import { ambChainId } from '../providers';

export const getDestinationNet = (contractAddress, bridges) => {
  let chainId;

  Object.keys(bridges).forEach((id) => {
    Object.keys(bridges[id]).forEach((type) => {
      console.log(contractAddress, bridges[id][type]);
      if (contractAddress === bridges[id][type]) {
        console.log(contractAddress);
        chainId = type === 'native' ? id : ambChainId;
      }
    });
  });
  return chainId;
};
