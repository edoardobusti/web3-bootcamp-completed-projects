// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token is ERC20 { // i used a simple token contract because no specific requirements were provided
    constructor(uint256 initialSupply) ERC20("Token", "TOKEN") {
        _mint(msg.sender, initialSupply);
    }
}

contract Nft is ERC721 {
    uint256 public totalSupply;
    address public owner;
    address public operator;

    event Mint(address indexed to, uint256 indexed tokenId);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OperatorChanged(address indexed previousOperator, address indexed newOperator);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operator, "not operator");
        _;
    }

    constructor() ERC721("Nft", "NFT") {
        owner = msg.sender;
    }

    function getTotalSupply() public view returns(uint256) {
        return totalSupply;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function setOperator(address _operator) external onlyOwner {
        require(_operator != address(0), "zero address");
        emit OperatorChanged(operator, _operator);
        operator = _operator;
    }

    function mint(address _to, uint256 _tokenId) external onlyOperator {
        _mint(_to, _tokenId);
        totalSupply++;
        emit Mint(_to, _tokenId);
    }

    function transferOwnership(address _newOwner) external onlyOwner { 
        require(_newOwner != address(0), "zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}

interface IMintableERC721 is IERC721 {
    function getTotalSupply() external view returns(uint256);
    function getOwner() external view returns(address);
    function mint(address _to, uint256 tokenId) external;
}

contract Operator {
    IMintableERC721 public nftCollection;
    IERC20 public token;

    event NftMinted(address indexed user, uint256 indexed tokenId);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    constructor(address _nftCollection, address _token) {
        nftCollection = IMintableERC721(_nftCollection);
        token = IERC20(_token);
    }
    
    function mintNftFor10Tokens() external {
        require(token.allowance(msg.sender, address(this)) >= 10, "insufficient allowance");
        
        token.transferFrom(msg.sender, address(this), 10);
        
        uint256 tokenId = nftCollection.getTotalSupply();
        nftCollection.mint(msg.sender, tokenId);
        
        emit NftMinted(msg.sender, tokenId);
        emit TokensTransferred(msg.sender, address(this), 10);
    }

    function withdraw() external {
        
        address nftCollectionOwner = nftCollection.getOwner();
        require(msg.sender == nftCollectionOwner);

        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "empty balance");


        token.transfer(nftCollectionOwner, balance);
        emit Withdraw(nftCollectionOwner, balance);
    }

}