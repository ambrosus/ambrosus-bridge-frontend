import React from 'react';

const ErrorContext = React.createContext({
  error: '',
  setError: () => {},
});

export default ErrorContext;
