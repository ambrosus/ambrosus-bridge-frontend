import { useContext } from 'react';
import ConfigContext from '../contexts/ConfigContext/context';

const useBridges = () => {
  const { bridges } = useContext(ConfigContext);
  return bridges;
};

export default useBridges;
