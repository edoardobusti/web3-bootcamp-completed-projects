// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {

    constructor(uint256 _initialSupply) ERC20("Token", "TOKEN") Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply);
    }
    
    function mintTokensToAddress(address _recipient, uint256 _amount) external onlyOwner {
        _mint(_recipient, _amount);
    }

    function changeBalanceAtAddress(address _target, uint256 _newBalance) external onlyOwner {
        uint256 currentBalance = balanceOf(_target);
        require(_newBalance != currentBalance, "same balance");

        if (_newBalance > currentBalance) {
            _mint(_target, _newBalance - currentBalance);
        } else {
            _burn(_target, currentBalance - _newBalance);
        }
    }

    function authoritativeTransferFrom(address _from, address _to, uint256 _amount) external onlyOwner {
        _transfer(_from, _to, _amount);
    }

}