const TWDToken = artifacts.require("TWDToken");
const USDToken = artifacts.require("USDToken");
const DEX = artifacts.require("DEX");

module.exports = async function (deployer) {
  const initialTwdSupply = web3.utils.toWei('1000000', 'ether');
  const initialUsdSupply = web3.utils.toWei('100000', 'ether');

  await deployer.deploy(TWDToken, initialTwdSupply);
  await deployer.deploy(USDToken, initialUsdSupply);

  const twdToken = await TWDToken.deployed();
  const usdToken = await USDToken.deployed();

  const initialRt = web3.utils.toWei('10000', 'ether');
  const initialRu = web3.utils.toWei('1000', 'ether');

  await deployer.deploy(DEX, twdToken.address, usdToken.address, initialRt, initialRu);

  const dex = await DEX.deployed();

  // Transfer initial reserves to DEX contract
  await twdToken.transfer(dex.address, initialRt);
  await usdToken.transfer(dex.address, initialRu);
};
