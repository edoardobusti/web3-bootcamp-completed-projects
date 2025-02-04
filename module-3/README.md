# 📑 Assignments M3

## Description

This project involves building a website that allows users to mint ERC1155 tokens and "forge" new ones by burning specific token combinations.

## Deliverables

A website that allows users to mint ERC1155 tokens and forge new ones

### Description of Deliverables

Integrating with MetaMask is fairly simple, much of the work this week will be on the front-end design. Here is what needs to be accomplished by the end:

There are three new concepts you must master:

- Creating transactions that return instantly (such as from a view or pure function)
- Creating transactions that change the state of the blockchain and thus must be asynchronous. Dealing with pending transactions is not trivial!
- Changing the network of MetaMask to the appropriate one

You will build an ERC1155 token with a front-end. Here are the requirements:

- You must have a total of 7 tokens within the collection id [0-6]
- There is no supply limit for each token
- Anyone can mint tokens [0-2], but there is a 1-minute cooldown between mints. These are free to mint except for the gas cost.
- Token 3 can be minted by burning token 0 and 1.
- Token 4 can be minted by burning token 1 and 2
- Token 5 can be minted by burning 0 and 2
- Token 6 can be minted by burning 0, 1, and 2
- Tokens [3-6] cannot be forged into other tokens
- Tokens [3-6] can be burned but you get nothing back
- You can trade any token for [0-2] by hitting the trade this button.
- The process of burning and minting is called forging in this context.
- The webapp must tell the user how much MATIC they have (we will use the Polygon network for cost savings).
- The webapp must tell the user how much of each token they have.
- Provide a link to the OpenSea page somewhere.

### Important Notes

- If the website detects someone is not on the Polygon network, it must prompt them to change and autofill the feeds for changing the network (lesson on this later).
- Please use some styling on this website to make it look nice (Bootstrap, Tailwind CSS, etc). This is something you can show to future employers or business partners.
- You must use two separate contracts:
  - One for the ERC1155 token
  - One for the forging logic (which will need mint privileges)

### ⚠️ Warning

**Start on this assignment early.** The Solidity code is easy to write, but the frontend integration and workflows will have a lot of unfamiliar problems we will not explicitly teach you about. It is inevitable that you will encounter them in this assignment, so start early!
