# 📑 Assignments M2

This folder contains assignments for **Module 2** of the Web3 Solidity Bootcamp. In this module, the focus is on building and deploying **NFT (ERC721)** contracts, integrating them with OpenSea, and creating an ecosystem where NFTs can be minted using **ERC20 tokens**. The assignment also includes the creation of a staking mechanism for NFTs, enabling users to earn ERC20 tokens in return.

## Deliverables

1. **Build an NFT contract and integrate it on OpenSea**
2. **Create an NFT that can be minted with ERC20 tokens**

## Description of Deliverables

### 1. **Build an NFT contract and integrate it on OpenSea**

Create an NFT that can be minted for free and has a collection of 10 items with traits and pictures. It should work on OpenSea per the tutorial. Use **Goerli** or **Polygon** for gas savings. Make sure I can mint your NFT from Etherscan!

### 2. **Create an NFT that can be minted with ERC20 tokens**

You must create **3 separate smart contracts**:

- An **ERC20 token**
- An **ERC721 token**
- A third smart contract that has the authority to receive ERC20 tokens and mint.

Create an NFT smart contract that will mint if the user pays **10 ERC20 tokens** from a separate ERC20 token that you create (use 18 decimal places as usual).

**Hint**: The user will need to approve the transfer of ERC20 tokens first.

### 3. **Staking NFTs**

Create **3 separate smart contracts**:

- An **ERC20 token**
- An **ERC721 token**
- A third smart contract that can mint new ERC20 tokens and receive ERC721 tokens.

A classic feature of NFTs is being able to receive them to stake tokens.

Create a contract where users can send their NFTs and withdraw **10 ERC20 tokens** every 24 hours. The user can withdraw the NFT at any time. The smart contract must take possession of the NFT and only the user should be able to withdraw it. Beware of the corner case of re-staking to bypass the timer.

**IMPORTANT**: You must be able to transfer the NFT as shown in the recorded YouTube video available in the NFT tutorial lesson.

**Hint**: To test the contract, use a shorter timeframe. Remix will respect local timestamps. We will discuss actual testing later.

### Where people commonly mess up:

- Not verifying the contract on Etherscan
- Forgetting decimals in ERC20
- Not properly securing the communication among the three contracts
- Forcing people to withdraw the NFT to get their tokens
