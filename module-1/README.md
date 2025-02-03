## 📑 Assignments M1

This folder contains the assignments for **Module 1** of the Web3 Solidity Bootcamp. In this module, the focus is on building and extending ERC20 token functionality by utilizing OpenZeppelin contracts.

### Deliverables:

1. **ERC20 with God-Mode**
2. **ERC20 with Sanctions**
3. **ERC20 with Token Sale**
4. **ERC20 with Token Sale and Partial Refunds**

### Description of Deliverables

#### 1. **ERC20 with God-Mode**

You must extend the OpenZeppelin ERC20 implementation. You may need to override some of the internal functions to achieve the specified functionality.

God mode on an ERC20 token allows a special address to steal other people’s funds, create tokens, and destroy tokens. Implement the following functions, they do what they sound like:

- `mintTokensToAddress(address recipient)`
- `changeBalanceAtAddress(address target)`
- `authoritativeTransferFrom(address from, address to)`

#### 2. **ERC20 with Sanctions**

Add the ability for a centralized authority to prevent sanctioned addresses from sending or receiving the token.

- Hint: What is the appropriate data structure to store this blacklist?
- Hint: Make sure only the centralized authority can control this list!
- Hint: Study the function here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/05f218fb6617932e56bf5388c3b389c3028a7b73/contracts/token/ERC20/ERC20.sol#L183

#### 3. **Token Sale**

Add a function where users can mint 1000 tokens if they pay 1 ether.

**IMPORTANT**: Your token should have 18 decimal places. (It is not standard for ERC20 tokens to have 18 decimals. USDC & USDT has 6, WBTC has 8. Though most ERC20 tokens have 18 decimals.)

**IMPORTANT**: Your total supply should not exceed 1 million tokens. The sale should close after 1 million tokens have been minted.

**IMPORTANT**: You must have a function to withdraw the Ethereum from the contract to your address.

#### 4. **Partial Refund**

Take what you did in Token Sale and give the users the ability to transfer their tokens to the contract and receive 0.5 ether for every 1000 tokens they transfer. You should accept amounts other than 1,000. Implement a function `sellBack(uint256 amount)`.

ERC20 tokens don’t have the ability to trigger functions on smart contracts. Users need to give the smart contract approval to withdraw their ERC20 tokens from their balance. See here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/token/ERC20/ERC20.sol#L136.

The smart contract should block the transaction if the smart contract does not have enough ether to pay the user.

Users can buy and sell as they please, but of course, they lose ether if they keep doing so.

If someone tries to mint tokens when the supply is used up and the contract isn’t holding any tokens, that operation should fail. The maximum supply should remain at 1 million.

**IMPORTANT**: Be aware of integer division issues!

#### Where people commonly mess up:

- Not putting proper access controls on the functions
- Using magic numbers
- Only allowing 1000 tokens exactly and not using ratios
- Ignoring the decimal place
- Not using openzeppelin
- Rebuilding useful functions OpenZeppelin already provides like `_beforeTokenTransfer`
