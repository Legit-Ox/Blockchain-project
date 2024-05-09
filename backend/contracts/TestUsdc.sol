// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./ERC20.sol";

contract TestUSDC is ERC20 {
    constructor() ERC20("TestUSDC", "USDC") {}

    function mintTokens(address reciever, uint256 tokenAmount) external {
        _mint(reciever, tokenAmount * (10 ** 18));
    }
}
