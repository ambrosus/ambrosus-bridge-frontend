import React, { useState } from 'react';
import ErrorContext from './context';

const ErrorProvider = (props) => {
  const [error, setError] = useState('');

  return <ErrorContext.Provider value={{ error, setError }} {...props} />;
};

export default ErrorProvider;
