// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
    IERC20 public twdToken;
    IERC20 public usdToken;
    uint256 public Rt;  // Reserve for TWD
    uint256 public Ru;  // Reserve for USD

    constructor(address _twdToken, address _usdToken, uint256 initialRt, uint256 initialRu) {
        twdToken = IERC20(_twdToken);
        usdToken = IERC20(_usdToken);
        Rt = initialRt;
        Ru = initialRu;
    }

    function tradeTWDForUSD(uint256 x) public payable returns (bool) {
        require(twdToken.transferFrom(msg.sender, address(this), x), "Transfer failed");
        uint256 y = Ru - (Rt * Ru) / (Rt + x);
        require(usdToken.transfer(msg.sender, y), "Transfer failed");
        Rt += x;
        Ru -= y;
        return true;
    }

    function tradeUSDForTWD(uint256 y) public payable returns (bool) {
        require(usdToken.transferFrom(msg.sender, address(this), y), "Transfer failed");
        uint256 x = Rt - (Rt * Ru) / (Ru + y);
        require(twdToken.transfer(msg.sender, x), "Transfer failed");
        Rt -= x;
        Ru += y;
        return true;
    }

    function getReserves() public view returns (uint256, uint256) {
        return (Rt, Ru);
    }
}
