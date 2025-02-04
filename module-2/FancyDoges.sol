/*
    I discovered some fancy DOGE images on OpenSea and used some of them for this exercise, pinning the images and custom metadata on IPFS.
    Contract deployed on Polygon Amoy Testnet at txn 0x1561ed2a85f3d8a720dbbb26a884b6716785834b4d388b12d6130f73d445a692
    Link to OpenSea: https://testnets.opensea.io/collection/fancydoges
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FancyDoges is ERC721 {
    uint8 public totalSupply = 0;
    uint8 public constant MAX_SUPPLY = 10;

    constructor() ERC721("FancyDoges", "FANCYDOGES") {}

    function mint() external payable {
        require(totalSupply < MAX_SUPPLY, "max supply reached");

        _mint(msg.sender, totalSupply);
        totalSupply++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://Qmb3mu7jC4WWc2i7WQuzFpnWzeX4aNtRnuzDsFder5vYmQ/";
    }
}