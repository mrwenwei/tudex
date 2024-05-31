const TWDToken = artifacts.require("TWDToken");
const USDToken = artifacts.require("USDToken");
const DEX = artifacts.require("DEX");

contract("DEX", (accounts) => {
    it("should init dex reserves correctly", async () => {
        const dex = await DEX.deployed();
        const reserves = await dex.getReserves();
        assert.equal(reserves[0].toString(), web3.utils.toWei("10000", "ether"));
        assert.equal(reserves[1].toString(), web3.utils.toWei("1000", "ether"));
    });

    it("should trade dex reserves correctly", async () => {
        const twdToken = await TWDToken.deployed();
        const usdToken = await USDToken.deployed();
        const dex = await DEX.deployed();

        // trade 6000 TWD for 375 USD
        const initialUsdBalance = await usdToken.balanceOf(accounts[0]);
        await twdToken.approve(dex.address, web3.utils.toWei("6000", "ether"), { from: accounts[0] });
        await dex.tradeTWDForUSD(web3.utils.toWei("6000", "ether"), { from: accounts[0] });
        const finalUsdBalance = await usdToken.balanceOf(accounts[0]);
        const remainReserves = await dex.getReserves();
        const expectedUSD = initialUsdBalance.add(web3.utils.toBN(web3.utils.toWei("375", "ether")));
        assert.equal(remainReserves[0].toString(), web3.utils.toWei("16000", "ether"));
        assert.equal(remainReserves[1].toString(), web3.utils.toWei("625", "ether"));
        assert.equal(finalUsdBalance.toString(), expectedUSD.toString(), `Expected ${finalUsdBalance} to equal ${expectedUSD}`);

        // trade 375 USD for 6000 TWD
        const initialTwdBalance = await twdToken.balanceOf(accounts[0]);
        await usdToken.approve(dex.address, web3.utils.toWei("375", "ether"), { from: accounts[0] });
        await dex.tradeUSDForTWD(web3.utils.toWei("375", "ether"), { from: accounts[0] });
        const finalTwdBalance = await twdToken.balanceOf(accounts[0]);
        const expectedTWD = initialTwdBalance.add(web3.utils.toBN(web3.utils.toWei("6000", "ether")));
        remainReserves2 = await dex.getReserves();
        assert.equal(remainReserves2[0].toString(), web3.utils.toWei("10000", "ether"));
        assert.equal(remainReserves2[1].toString(), web3.utils.toWei("1000", "ether"));
        assert.equal(finalTwdBalance.toString(), expectedTWD.toString(), `Expected ${finalTwdBalance} to equal ${expectedTWD}`);
    });
});