import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useLiveQuery } from 'dexie-react-hooks';
import changeChainId from '../utils/ethers/changeChainId';
import { ambChainId, ethChainId } from '../utils/providers';
import { db } from '../db';
/*eslint-disable*/

const Mint = () => {
  const { library } = useWeb3React();

  const [formData, setFormData] = useState({
    address: '',
    amount: '',
    wrapWETHAmount: '',
    wrapSAMBAmount: '',
  });

  const tokenList = useLiveQuery(() => db.tokens.toArray());

  const handleFormData = (e) => {
    const { value, id } = e.target;

    setFormData((state) => ({
      ...state,
      [id]: value,
    }));
  };

  const tokenABI =
    '[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}]';

  const wrapSAMBCoins = async () => {
    await changeChainId(library.provider, ambChainId);

    const SAMB = await db.tokens.get({ symbol: 'SAMB', chainId: ambChainId });

    const contract = new ethers.Contract(
      SAMB.address,
      tokenABI,
      library.getSigner(),
    );

    contract.deposit({
      value: ethers.utils.parseEther(formData.wrapSAMBAmount),
      gasLimit: 8000000,
      gasPrice: 1,
    });
  };

  const wrapWETHCoins = async () => {
    await changeChainId(library.provider, ethChainId);

    const WETH = await db.tokens.get({ symbol: 'WETH', chainId: ethChainId });

    const contract = new ethers.Contract(
      WETH.address,
      tokenABI,
      library.getSigner(),
    );

    contract.deposit({
      value: ethers.utils.parseEther(formData.wrapWETHAmount),
      gasLimit: 8000000,
      gasPrice: 1,
    });
  };

  return (
    <div className="mint-page">
      <label htmlFor="wrapAmount">AMB amount to wrap</label>
      <input
        id="wrapSAMBAmount"
        value={formData.wrapSAMBAmount}
        onChange={handleFormData}
        type="number"
      />
      <button className="button button_black" onClick={wrapSAMBCoins}>
        wrap
      </button>
      <br />
      <label htmlFor="wrapWETHAmount">WETH amount to wrap</label>
      <input
        id="wrapWETHAmount"
        value={formData.wrapWETHAmount}
        onChange={handleFormData}
        type="number"
      />
      <button className="button button_black" onClick={wrapWETHCoins}>
        wrap
      </button>
      <br />
      <ul>
        {tokenList &&
          tokenList.map((token, i) => (
            <li key={token.chainId + token.address + i}>
              <b>{token.name}:</b>
              <ul>
                {Object.keys(token.addresses).map((key, i) => (
                  <li key={token.address + i}>
                    {key}: {token.addresses[key]}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Mint;
