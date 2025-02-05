const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20TokenSale", function () {
  let TokenSale, tokenSale, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TokenSale = await ethers.getContractFactory("TokenSale");
    tokenSale = await TokenSale.deploy();
    tokenAddress = await tokenSale.token();

    const Token = await ethers.getContractFactory("Token");
    token = Token.attach(tokenAddress);
  });

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      expect(await tokenSale.owner()).to.equal(owner.address);
    });

    it("Should set the token sale price correctly", async function () {
      expect(await tokenSale.tokenSalePrice()).to.equal(ethers.parseEther("1"));
    });

    it("Should start with supply at zero", async function () {
      expect(await tokenSale.mintedSupply()).to.equal(0);
    });
  });

  describe("Buying Tokens", function () {
    it("Should revert if maximum supply is reached", async function () {
      const value = ethers.parseEther("1");
      await tokenSale.connect(addr1).buy({ value });
      await expect(tokenSale.connect(addr1).buy({ value })).to.be.revertedWith(
        "minting would exceed the cap"
      );
    });

    it("Should revert if value is zero", async function () {
      await expect(tokenSale.connect(addr1).buy()).to.be.revertedWith(
        "value should not be zero"
      );
    });

    it("Should allow buying tokens", async function () {
      const value = ethers.parseEther("1");
      await tokenSale.connect(addr1).buy({ value });

      const tokensMinted = ethers.parseEther("1000");
      expect(await token.balanceOf(addr1.address)).to.equal(tokensMinted);
    });

    it("Should not mint new tokens if the TokenSale contract holds some", async function () {
      const value = ethers.parseEther("0.5");
      const sellAmount = ethers.parseEther("500");
      await tokenSale.connect(addr1).buy({ value });

      await token.connect(addr1).approve(tokenSale.target, sellAmount);
      await tokenSale.connect(addr1).sellBack(sellAmount);

      expect(await token.balanceOf(tokenSale.target)).to.equal(sellAmount);

      await tokenSale.connect(addr2).buy({ value });

      expect(await token.balanceOf(tokenSale.target)).to.equal(0);
    });

    it("Should emit Buy event when buying tokens", async function () {
      const value = ethers.parseEther("1");
      await expect(tokenSale.connect(addr1).buy({ value }))
        .to.emit(tokenSale, "Buy")
        .withArgs(addr1.address, ethers.parseEther("1000"));
    });
  });

  describe("Selling Tokens", function () {
    beforeEach(async function () {
      const value = ethers.parseEther("1");
      await tokenSale.connect(addr1).buy({ value });
    });

    it("Should revert if amount is zero", async function () {
      await expect(tokenSale.connect(addr1).sellBack(0)).to.be.revertedWith(
        "value should not be zero"
      );
    });

    it("Should revert if contract is not approved as spender", async function () {
      const sellAmount = ethers.parseEther("1000");
      await expect(
        tokenSale.connect(addr1).sellBack(sellAmount)
      ).to.be.revertedWith("contract not approved as spender");
    });

    it("Should revert if contract balance is insufficient for refund", async function () {
      const sellAmount = ethers.parseEther("1000");

      const contractBalanceEther = ethers.parseEther("0");

      await ethers.provider.send("hardhat_setBalance", [
        tokenSale.target,
        ethers.toBeHex(contractBalanceEther),
      ]);

      await token.connect(addr1).approve(tokenSale.target, sellAmount);

      await expect(
        tokenSale.connect(addr1).sellBack(sellAmount)
      ).to.be.revertedWith("insufficient balance for refund");
    });

    it("Should allow users to sell back tokens", async function () {
      const sellAmount = ethers.parseEther("1000");

      await token.connect(addr1).approve(tokenSale.target, sellAmount);
      await tokenSale.connect(addr1).sellBack(sellAmount);

      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });
  });

  describe("Withdrawing Funds", function () {
    it("Should allow the owner to withdraw funds and emit event", async function () {
      const value = ethers.parseEther("1");
      await tokenSale.connect(addr1).buy({ value });

      const preBalance = await ethers.provider.getBalance(owner);
      const contractBalance = await ethers.provider.getBalance(
        tokenSale.target
      );

      await expect(tokenSale.connect(owner).withdraw())
        .to.emit(tokenSale, "Withdraw")
        .withArgs(contractBalance);

      const postBalance = await ethers.provider.getBalance(owner);
      expect(postBalance).to.be.gt(preBalance);
    });

    it("Should revert if non-owner attempts withdrawal", async function () {
      await expect(tokenSale.connect(addr1).withdraw()).to.be.revertedWith(
        "not owner"
      );
    });
  });
});
