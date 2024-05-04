// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ERC20.sol";

contract FinalBancor is ERC20 {
    // uint256 public constant A = 1;
    // uint256 public constant B = 100;
    uint256 public constant MAX_RESERVE_RATIO = 1000000; // Precision of 6 decimal places
    uint256 public reserveBalance;
    uint256 public reserveRatio;

    uint256 public supply;
    mapping(address => uint256) public balances;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _reserveRatio
    ) ERC20(name, symbol) {
        require(_reserveRatio <= MAX_RESERVE_RATIO, "Invalid reserve ratio");
        reserveRatio = _reserveRatio;
    }

    function buyTokens(uint256 tokenAmount) public payable {
        uint256 ethAmount = calculateEthAmount(tokenAmount, true);
        require(msg.value >= ethAmount, "Insufficient Funds");
        _mint(msg.sender, tokenAmount);
        balances[msg.sender] += tokenAmount;
        supply += tokenAmount;
        payable(msg.sender).transfer(msg.value - ethAmount);
    }

    function sellTokens(uint256 tokenAmount) public payable {
        uint256 ethAmount = calculateEthAmount(tokenAmount, false);
        require(balances[msg.sender] >= tokenAmount, "Insufficient Balances");
        _burn(payable(msg.sender), tokenAmount);
        balances[msg.sender] -= tokenAmount;
        supply -= tokenAmount;
        payable(msg.sender).transfer(ethAmount);
    }

    function calculateEthAmount(
        uint256 tokenAmount,
        bool buying
    ) public view returns (uint256) {
        uint256 initial = 0;
        uint256 f = 0;

        if (buying) {
            initial = integrate(supply);
            f = integrate(supply + tokenAmount);
        } else {
            f = integrate(supply);
            initial = integrate(supply - tokenAmount);
        }

        uint256 ethAmount = f - initial;
        return ethAmount;
    }

    function see(uint256 number2) public view returns (uint256) {
        return ((100 / reserveRatio) - 1) ** number2;
    }

    function integrate(uint256 number) public view returns (uint256) {
        uint256 exponent = (100 / reserveRatio) - 1;
        uint256 t = ((number ** exponent) * (number + 1) * (reserveRatio));
        return t / 100;
    }

    function getCurrentPrice() public view returns (uint256) {
        uint256 exponent = (100 / reserveRatio) - 1;
        uint256 price = ((supply ** exponent) * (supply + 1) * (reserveRatio));
        return price / 100;
    }

    receive() external payable {}

    fallback() external payable {}
}
