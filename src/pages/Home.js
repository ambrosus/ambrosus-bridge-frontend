import * as React from 'react';
import { Layout } from '../components/Layout';
import ConnectWallet from '../components/Home/ConnectWallet';

const Home = () => (
  <Layout title="ETH to BSC Bridge">
    <ConnectWallet />
  </Layout>
);

export default Home;
