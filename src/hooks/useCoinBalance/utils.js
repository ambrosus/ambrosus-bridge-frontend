export const getCachedCoinBalance = (tokenAddress) => {
  const cachedBalanceString = sessionStorage.getItem(tokenAddress);
  if (cachedBalanceString) {
    return JSON.parse(cachedBalanceString);
  }
  return {
    string: '',
    formattedString: '',
    float: 0.0,
  };
};
