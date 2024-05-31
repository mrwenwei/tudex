import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import DexAbi from './abi/DEX.json';
import TwdTokenAbi from './abi/TWDToken.json';
import UsdTokenAbi from './abi/USDToken.json';

const dexAddress = process.env.REACT_APP_DEX_ADDRESS;
const twdTokenAddress = process.env.REACT_APP_TWD_TOKEN_ADDRESS;
const usdTokenAddress = process.env.REACT_APP_USD_TOKEN_ADDRESS;

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountBalance, setSelectedAccountBalance] = useState(['', '']);
  const [twdReserves, setTwdReserves] = useState('');
  const [usdReserves, setUsdReserves] = useState('');
  const [shouldFetch, setShouldFetch] = useState(true);
  const [tradeAmount, setTradeAmount] = useState('');

  useEffect(() => {
    async function initWeb3() {
      const web3Instance = new Web3('http://127.0.0.1:8545');
      setWeb3(web3Instance);
      try {
        const ac = await web3Instance.eth.getAccounts();
        setAccounts(ac);
        if (ac.length > 0) {
          setSelectedAccount(ac[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    initWeb3();
  }, []);

  useEffect(() => {
    async function loadBalances() {
      if (web3 && selectedAccount && shouldFetch) {
        const dexContract = new web3.eth.Contract(DexAbi.abi, dexAddress);
        const twdTokenContract = new web3.eth.Contract(TwdTokenAbi.abi, twdTokenAddress);
        const usdTokenContract = new web3.eth.Contract(UsdTokenAbi.abi, usdTokenAddress);

        try {
          const reserves = await dexContract.methods.getReserves().call();
          setTwdReserves(web3.utils.fromWei(reserves[0], 'ether'));
          setUsdReserves(web3.utils.fromWei(reserves[1], 'ether'));
          const accountTwdBalance = web3.utils.fromWei(await twdTokenContract.methods.balanceOf(selectedAccount).call(), 'ether');
          const accountUsdBalance = web3.utils.fromWei(await usdTokenContract.methods.balanceOf(selectedAccount).call(), 'ether');
          setSelectedAccountBalance([accountTwdBalance, accountUsdBalance]);
          setShouldFetch(false);
        } catch (error) {
          console.error(error);
        }
      }
    }

    loadBalances();
  }, [web3, selectedAccount, shouldFetch]);

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
    setShouldFetch(true);
  };

  const handleTradeAmountChange = (event) => {
    setTradeAmount(event.target.value);
  };

  const tradeTWDForUSD = async () => {
    if (web3 && selectedAccount) {
      const twdTokenContract = new web3.eth.Contract(TwdTokenAbi.abi, twdTokenAddress);
      const usdTokenContract = new web3.eth.Contract(UsdTokenAbi.abi, usdTokenAddress);
      const dexContract = new web3.eth.Contract(DexAbi.abi, dexAddress);

      try {
        const initialUsdBalance = await usdTokenContract.methods.balanceOf(selectedAccount).call();
        await twdTokenContract.methods.approve(dexAddress, web3.utils.toWei(tradeAmount, 'ether')).send({ from: selectedAccount });
        await dexContract.methods.tradeTWDForUSD(web3.utils.toWei(tradeAmount, 'ether')).send({ from: selectedAccount });
        const finalUsdBalance = await usdTokenContract.methods.balanceOf(selectedAccount).call();
        const receivedUsdAmount = web3.utils.fromWei(finalUsdBalance - initialUsdBalance, 'ether');
        
        window.alert('Trade TWD:' + tradeAmount + ' for USD:' + receivedUsdAmount + ' successfully!');
        setShouldFetch(true);
      } catch (error) {
        console.error(error);
        window.alert('Failed to trade!');
      }
      setTradeAmount('');
    }
  };

  const tradeUSDForTWD = async () => {
    if (web3 && selectedAccount) {
      const twdTokenContract = new web3.eth.Contract(TwdTokenAbi.abi, twdTokenAddress);
      const usdTokenContract = new web3.eth.Contract(UsdTokenAbi.abi, usdTokenAddress);
      const dexContract = new web3.eth.Contract(DexAbi.abi, dexAddress);

      try {
        const initialTwdBalance = await twdTokenContract.methods.balanceOf(selectedAccount).call();
        await usdTokenContract.methods.approve(dexAddress, web3.utils.toWei(tradeAmount, 'ether')).send({ from: selectedAccount });
        await dexContract.methods.tradeUSDForTWD(web3.utils.toWei(tradeAmount, 'ether')).send({ from: selectedAccount });
        const finalTwdBalance = await twdTokenContract.methods.balanceOf(selectedAccount).call();
        const receivedTwdAmount = web3.utils.fromWei(finalTwdBalance - initialTwdBalance, 'ether');
        
        window.alert('Trade USD:' + tradeAmount + ' for TWD:' + receivedTwdAmount + ' successfully!');
        setShouldFetch(true);
      } catch (error) {
        console.error(error);
        window.alert('Failed to trade!');
      }
      setTradeAmount('');
    }
  };

  return (
    <div className="App">
      <h1>TUDEX</h1>
      <div>
        <label htmlFor="accountSelect">Select Account: </label>
        <select id="accountSelect" value={selectedAccount} onChange={handleAccountChange}>
          {accounts.map((account, idx) => (
            <option key={account} value={account}>
              {idx}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p>My account TWD balance: {selectedAccountBalance[0]}</p>
        <p>My account USD balance: {selectedAccountBalance[1]}</p>
      </div>
      <div>
        <p>DEX TWD reserves: {twdReserves}</p>
        <p>DEX USD reserves: {usdReserves}</p>
      </div>
      <div>
        <h2>Trade</h2>
        <input type="number" value={tradeAmount} onChange={handleTradeAmountChange} />
        <button onClick={tradeTWDForUSD}>Trade TWD for USD</button>
        <button onClick={tradeUSDForTWD}>Trade USD for TWD</button>
      </div>
    </div>
  );
}

export default App;
