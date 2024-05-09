// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./ERC20.sol";

contract FinalBancor is ERC20 {
    uint256 public constant MAX_RESERVE_RATIO = 1000000; // Precision of 6 decimal places
    // uint256 public reserveBalance;
    uint256 public reserveRatio;
    // uint256 public conversion = 2;

    address public ad = 0x50454014ca46207770a879D35BC64E5D269DC0d4;
    //  AggregatorV3Interface internal priceFeed;

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

    function buyTokensUsingMatic(uint256 tokenAmount) public payable {
        uint256 maticAmount = calculateMaticAmount(tokenAmount, true) *
            (10 ** 18);
        require(msg.value >= maticAmount, "Insufficient Funds");
        _mint(msg.sender, tokenAmount * (10 ** 18));
        balances[msg.sender] += tokenAmount * (10 ** 18);
        supply += tokenAmount;
        payable(msg.sender).transfer(msg.value - maticAmount);
    }

    function sellTokensUsingMatic(uint256 tokenAmount) public payable {
        uint256 maticAmount = calculateMaticAmount(tokenAmount, false) *
            (10 ** 18);
        require(
            balances[msg.sender] >= tokenAmount * (10 ** 18),
            "Insufficient Balances"
        );
        _burn(payable(msg.sender), tokenAmount * (10 ** 18));
        balances[msg.sender] -= tokenAmount * (10 ** 18);
        supply -= tokenAmount;
        payable(msg.sender).transfer(maticAmount);
    }

    function buyTokensusingUSDC(uint256 tokenAmount) public {
        // uint256 ethAmount = calculateEthAmount(tokenAmount, true);
        // require(msg.value >= ethAmount, "Insufficient Funds");

        uint256 usdcamount = calculateUSDCAmount(tokenAmount, true) *
            (10 ** 18);

        address usdcTokenAddress = address(ad);
        ERC20 usdcToken = ERC20(usdcTokenAddress);
        require(
            usdcToken.transferFrom(msg.sender, address(this), usdcamount),
            "USDC transfer failed"
        );
        // uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        // require(allowance >= usdcamount, "Insufficient allowance");
        // usdcToken.approve(msg.sender, type(uint256).max);

        _mint(msg.sender, tokenAmount * (10 ** 18));
        balances[msg.sender] += tokenAmount * (10 ** 18);
        supply += tokenAmount;
    }

    function sellTokensusingUSDC(uint256 tokenAmount) public {
        uint256 usdcAmounts = calculateUSDCAmount(tokenAmount, false) *
            (10 ** 18);

        address usdcTokenAddress = address(ad);
        ERC20 usdcToken = ERC20(usdcTokenAddress);
        usdcToken.approve(address(this), usdcAmounts * (10 ** 18));
        require(
            usdcToken.transferFrom(address(this), msg.sender, usdcAmounts),
            "USDC transfer failed"
        );

        require(
            balances[msg.sender] >= tokenAmount * (10 ** 18),
            "Insufficient Balances"
        );
        _burn(payable(msg.sender), tokenAmount * (10 ** 18));
        balances[msg.sender] -= tokenAmount * (10 ** 18);
        supply -= tokenAmount;
    }

    function calculateMaticAmount(
        uint256 tokenAmount,
        bool buying
    ) public view returns (uint256) {
        uint256 initial = 0;
        uint256 f = 0;

        if (buying) {
            initial = bondingCurveCalculations(supply);
            f = bondingCurveCalculations(supply + tokenAmount);
        } else {
            f = bondingCurveCalculations(supply);
            initial = bondingCurveCalculations(supply - tokenAmount);
        }

        uint256 ethAmount = f - initial;
        return ethAmount;
    }

    function calculateUSDCAmount(
        uint256 tokenAmount,
        bool buying
    ) public view returns (uint256) {
        uint256 price = getLatestPrice();
        if (buying) {
            uint256 temp = calculateMaticAmount(tokenAmount, true);
            return (temp * price) / 10 ** 8;
        } else {
            uint256 temp = calculateMaticAmount(tokenAmount, false);
            return (temp * price) / 10 ** 8;
        }
    }

    function bondingCurveCalculations(
        uint256 number
    ) public view returns (uint256) {
        uint256 exponent = (100 / reserveRatio) - 1;
        uint256 t = ((number ** exponent) * (number + 1) * (reserveRatio));
        return t / 100;
    }

    function getCurrentPrice() public view returns (uint256) {
        uint256 exponent = (100 / reserveRatio) - 1;
        uint256 price = ((supply ** exponent) * (supply + 1) * (reserveRatio));
        return price / 100;
    }

    function getLatestPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x001382149eBa3441043c1c66972b4772963f5D43
        );
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // Assuming the price is scaled by 10^8
        // Convert the price to a fixed-point number using FixedPoint
        uint256 castPrice = uint256(price);

        return castPrice;
    }

    function getMaticBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUSDCBalance() public view returns (uint256) {
        ERC20 token = ERC20(ad);
        return token.balanceOf(address(this));
    }

    function poolofUSDC(uint256 usdcamount) public {
        address usdcTokenAddress = address(ad);
        ERC20 usdcToken = ERC20(usdcTokenAddress);
        require(
            usdcToken.transferFrom(
                msg.sender,
                address(this),
                usdcamount * (10 ** 18)
            ),
            "USDC transfer failed"
        );
    }

    function poolofMattic() public payable {
        require(msg.value > 0, "No Ether sent with the transaction");
        address payable contractAddress = payable(address(this));
        contractAddress.transfer(msg.value);
    }

    receive() external payable {}

    fallback() external payable {}
}
