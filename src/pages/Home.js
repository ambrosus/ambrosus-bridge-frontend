import * as React from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import ConnectWallet from '../components/Home/ConnectWallet';

const Home = () => {
  const web3 = useWeb3React();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (web3.error instanceof UnsupportedChainIdError) {
      setError(
        'Unsupported network. Please connect to a supported network in the dropdown menu or in your wallet.',
      );
    } else {
      setError(null);
    }
  }, [web3]);

  return (
    <Layout title="ETH to BSC Bridge" error={error}>
      <ConnectWallet />
    </Layout>
  );
};

export default Home;
