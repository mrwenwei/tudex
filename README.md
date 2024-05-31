# TUDEX
In this project I created a solidy smart contract of DEX and deploy locally. Also created a simple UI to interact with the DEX.
You can follow the steps below to trade locally.

You can trade TWD to USD or USD to TWD on TUDEX!


## dex (solidity)

I created TWD token contract and USD token contract and a dex contract on `ERC20`.
Then deployed them on the local Ethereum simulator by `ganache`.

### INSTALLATION
(using node v20.14.0)
```
cd dex
npm i
```

### Run locally
#### Step 1
After the installation, we can start the local Ethereum simulator just type:
```
ganache
```

#### Step 2

In `DEX.sol`, I created 3 function
* `tradeTWDForUSD()` and `tradeUSDForTWD()`: transition of the TWD and USD
* `getReserves()`: return the balance that is still available on dex.

Then open another terminal to deploy the smart contract on it.
In `2_deploy_contracts.js` I initialize token TWD with 1000000 and USD with 100000.
Also initialize on dex with 10000 TWD and 1000 USD which described from the notion.

run the command and the contracts would be deployed to the blockchain:
```
truffle migrate
```

Here we need to record the contract address that displayed on terminal and copy it to `./dex-ui/.env`:
<img width="693" alt="截圖 2024-06-01 凌晨12 36 17" src="https://github.com/mrwenwei/tudex/assets/11289450/f3de543f-f2d5-4e79-9541-d789d259c523">

<img width="832" alt="截圖 2024-06-01 凌晨12 59 04" src="https://github.com/mrwenwei/tudex/assets/11289450/0281ac4e-fb37-4030-9c1c-4e275e46c031">

#### Step 3

In `dex_test.js` define the unit test of all the functioins.
* check if the dex has been deployed successfully.
* check if trade 6000 TWD would get 375 USD
* Then, check if trade 375 USD would get 6000 TWD

run the command to test the functions.
```
truffle test
```

<img width="401" alt="截圖 2024-06-01 凌晨12 40 25" src="https://github.com/mrwenwei/tudex/assets/11289450/d6f5a1a1-47c3-47d6-b870-ca13a655b23a">


## dex-ui (react)

Let's trade with UI!

### INSTALLATION

```
cd dex-ui
npm i
```

#### Step 1

Here we need put the ABI that we just generated to the working folder:
```
cp ../dex/build/contracts/DEX.json src/abi/DEX.json
cp ../dex/build/contracts/TWDToken.json src/abi/TWDToken.json
cp ../dex/build/contracts/USDToken.json src/abi/USDToken.json
```

#### Step 2

Then start the react UI:
```
npm start
```

Then You can use the account to trade with TUDEX!

<img width="763" alt="截圖 2024-05-31 晚上11 02 41" src="https://github.com/mrwenwei/tudex/assets/11289450/71fd7500-2a41-45e8-9a1d-1fadd156ace4">

<img width="780" alt="截圖 2024-05-31 晚上11 02 55" src="https://github.com/mrwenwei/tudex/assets/11289450/e0c3102c-e3d8-4891-bf03-84199dd3c686">


