// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20Capped {

    event Buy(address buyer, uint256 amount);
    event SellBack(address seller, uint256 amount);
    event Withdraw(uint256 amount);

    address public immutable owner;
    uint public immutable tokenSalePrice;
    uint public mintedSupply;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() ERC20("Token", "TOKEN") ERC20Capped(1000 * 10 ** 18) {
        owner = msg.sender;
        tokenSalePrice = 1 ether; 
    }

    receive() external payable {
        buy();
    }

    function buy() public payable {
        require(mintedSupply < cap(), "maximum supply reached");
        require(msg.value > 0, "value should not be zero");
        
        uint256 tokensToMint = (msg.value * 1000 ether) / tokenSalePrice; 

        require(mintedSupply + tokensToMint <= cap(), "would exceed max supply");

        uint256 contractTokenBalance = balanceOf(address(this));    

        uint256 tokensToTransfer = 0;


        if (contractTokenBalance > 0) {
            if (contractTokenBalance >= tokensToMint) {
                tokensToTransfer = tokensToMint; 
            } else {
                tokensToTransfer = contractTokenBalance; 
            }
            

            
            tokensToMint -= tokensToTransfer; 
            _transfer(address(this), msg.sender, tokensToTransfer); 
            mintedSupply += tokensToTransfer; 
        }

        if (tokensToMint > 0) {
            _mint(msg.sender, tokensToMint);
            mintedSupply += tokensToMint;
        }
        
        emit Buy(msg.sender, tokensToTransfer + tokensToMint);
    }

    function sellBack(uint256 _amount) external {
        require(_amount > 0, "value should not be zero");
        require(allowance(msg.sender, address(this)) >= _amount, "contract not approved as spender");

        uint256 cashback = (_amount * tokenSalePrice / 0.5 ether) / 1000 ether;

        require(address(this).balance >= cashback);
        transferFrom(msg.sender, address(this), _amount);

        payable(msg.sender).transfer(cashback);
        
        emit SellBack(msg.sender, _amount);
    }

    function withdraw() external onlyOwner {

        uint256 balance = address(this).balance;
        
        payable(owner).transfer(balance);
        
        emit Withdraw(balance);        
    }
}