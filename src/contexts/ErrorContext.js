import React from 'react';

// TODO: refactor this
const ErrorContext = React.createContext({
  error: '',
  setError: () => {},
});

export default ErrorContext;
