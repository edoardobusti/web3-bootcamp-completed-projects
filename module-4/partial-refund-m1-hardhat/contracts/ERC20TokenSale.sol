// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20Capped {

    address public immutable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address _owner) ERC20("Token", "TOKEN") ERC20Capped(1000 * 10**18) {
        owner = _owner;
    }

    function mint(address to, uint256 value) external onlyOwner {
        _mint(to,value);
    }
}

contract TokenSale {
    event Buy(address buyer, uint256 amount);
    event SellBack(address seller, uint256 amount);
    event Withdraw(uint256 amount);
    event DebugValue(string key, uint256 value);


    address public immutable owner;
    uint256 public immutable tokenSalePrice;
    uint256 public mintedSupply;

    Token public token;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }


    constructor() {
        owner = msg.sender;
        tokenSalePrice = 1 ether;
        token = new Token(address(this));
    }

    receive() external payable {
        buy();
    }

    function buy() public payable {
        require(msg.value > 0, "value should not be zero");


        uint256 tokensToMint = (msg.value * 1000 ether) / tokenSalePrice;

        require(tokensToMint + mintedSupply <= token.cap(), "minting would exceed the cap");

        uint256 contractTokenBalance = token.balanceOf(address(this));

        uint256 tokensToTransfer = 0;

        if (contractTokenBalance > 0) {
            if (contractTokenBalance >= tokensToMint) {
                tokensToTransfer = tokensToMint;
            } else {
                tokensToTransfer = contractTokenBalance;
            }

            tokensToMint -= tokensToTransfer;
            token.transfer(msg.sender, tokensToTransfer);
            mintedSupply += tokensToTransfer;
        }

        if (tokensToMint > 0) {
            token.mint(msg.sender, tokensToMint);
            mintedSupply += tokensToMint;
        }

        emit Buy(msg.sender, tokensToTransfer + tokensToMint);
    }

    function sellBack(uint256 _amount) external {
        require(_amount > 0, "value should not be zero");
        require(token.allowance(msg.sender, address(this)) >= _amount, "contract not approved as spender");


        uint256 cashback = (_amount * tokenSalePrice) / (2 ether * 1000);



        require(
            address(this).balance >= cashback,
            "insufficient balance for refund"
        );
        token.transferFrom(msg.sender, address(this), _amount);

        payable(msg.sender).transfer(cashback);

        emit SellBack(msg.sender, _amount);
        emit DebugValue("Cashback Calculated", cashback);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        payable(owner).transfer(balance);

        emit Withdraw(balance);
    }
}
