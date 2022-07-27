import { useContext } from 'react';
import ErrorContext from '../contexts/ErrorContext/context';

const useError = () => {
  const { error, setError } = useContext(ErrorContext);

  return { error, setError };
};

export default useError;
