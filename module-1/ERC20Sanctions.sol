// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address public owner;

    mapping(address => bool) private blacklisted;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(uint256 _initialSupply) ERC20("Token", "TOKEN") {
        owner = msg.sender;
        _mint(msg.sender, _initialSupply);
    }
    
    function transfer(address _to, uint256 _amount) public override returns(bool)  {
        require(!blacklisted[msg.sender], "sender is blacklisted");
        require(!blacklisted[_to], "recipient is blacklisted");

        _transfer(msg.sender, _to, _amount);
        
        return true;
    }

    function addToBlacklist(address _target) external onlyOwner {
        require(!blacklisted[_target], "blacklisted");
        
        blacklisted[_target] = true;
    }

    function removeFromBlacklist(address _target) external onlyOwner {
        require(blacklisted[_target], "not blacklisted");

        blacklisted[_target] = false;
    }
    
}