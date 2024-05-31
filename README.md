# TUDEX
You can trade TWD to USD or USD to TWD on TUDEX.

## dex (solidity)

In this project, I created TWD token and USD token and a dex contract on `ERC20`.
Then deployed them on the local Ethereum simulator by `ganache`.

### INSTALLATION
```
npm install -g ganache
npm install -g truffle
```

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

here 

#### Step 3

In `dex_test.js` define the unit test of all the functioins.
and run the command to test the functions.
```
truffle test
```

## dex-ui (react)


