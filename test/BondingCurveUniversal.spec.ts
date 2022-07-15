import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ethers, waffle } from "hardhat";
import { BondingCurveUniversalMock } from "../typechain";
import { ensureException } from "./utils/index";

describe("BondingCurveUniversal", () => {
  let instance: BondingCurveUniversalMock;
  let owner: SignerWithAddress;
  const decimals = 18;
  const startSupply = 10 * 10 ** 18; // 1
  const startPoolBalance = 10 ** 14; // one coin costs .0001 ether;
  const reserveRatio = Math.round((1 / 3) * 1000000) / 1000000;
  const solRatio = Math.floor(reserveRatio * 1000000);
  const gasPriceBad = 22 * 10 ** 18 + 1;

  beforeEach(async () => {
    const [ownerAddress] = await ethers.getSigners();
    owner = ownerAddress;
    const BondingCurveUniversalMock = await ethers.getContractFactory(
      "BondingCurveUniversalMock"
    );
    instance = await BondingCurveUniversalMock.deploy(
      startSupply,
      startPoolBalance,
      solRatio
    );
    await instance.deployed();
  });

  async function getRequestParams(amount: number) {
    const supply = await instance.totalSupply().then((d) => d.toNumber());
    const poolBalance = await instance.poolBalance().then((d) => d.toNumber());

    const price =
      poolBalance *
      ((1 + (amount * 10 ** 18) / supply) ** (1 / reserveRatio) - 1);
    return {
      supply,
      poolBalance,
      solRatio,
      price,
    };
  }

  it("should estimate price for token amount correctly", async () => {
    const amount = 13;
    const p = await getRequestParams(amount);
    const estimate = await instance.calculatePurchaseReturn(
      p.supply,
      p.poolBalance,
      solRatio,
      p.price
    );

    expect(Math.abs(estimate.toNumber() / 10 ** 18 - amount)).lessThanOrEqual(
      1,
      "estimate should equal original amount"
    );
  });

  it("should buy tokens correctly via default function", async () => {
    const amount = 8;

    const startBalance = await instance.balanceOf(owner.address);
    const p = await getRequestParams(amount);
    const txResp = await owner.sendTransaction({
      to: instance.address,
      value: Math.floor(p.price),
    });
    const buyTokens = await txResp.wait();
    // const buyTokens = await instance.send(Math.floor(p.price));
    console.log("buyTokens via default gas", buyTokens.gasUsed);

    // utils.logHelper(buyTokens.logs, 'LogBondingCurve');

    const endBalance = await instance.balanceOf(owner.address);
    const amountBought =
      endBalance.toNumber() / 10 ** decimals -
      startBalance.toNumber() / 10 ** decimals;
    expect(Math.abs(amountBought - amount)).lessThanOrEqual(
      1,
      "able to buy tokens via fallback"
    );
  });

  it("should buy tokens correctly", async () => {
    const amount = 14;

    const startBalance = await instance.balanceOf(owner.address);

    const p = await getRequestParams(amount);
    const buyResp = await instance.buy({
      from: owner.address,
      value: Math.floor(p.price),
    });
    const buyTokens = await buyResp.wait();
    console.log("buy gas", buyTokens.gasUsed);

    // utils.logHelper(buyTokens.logs, 'LogBondingCurve');
    const endBalance = await instance.balanceOf(owner.address);
    const amountBought =
      endBalance.toNumber() / 10 ** decimals -
      startBalance.toNumber() / 10 ** decimals;
    expect(Math.abs(amountBought - amount)).lessThanOrEqual(
      1,
      "able to buy tokens"
    );
  });

  it("should buy tokens a second time correctly", async () => {
    const amount = 5;

    const startBalance = await instance.balanceOf(owner.address);

    const p = await getRequestParams(amount);
    const buyTokens = await instance
      .buy({
        from: owner.address,
        value: Math.floor(p.price),
      })
      .then((resp) => resp.wait());
    console.log("buy gas", buyTokens.gasUsed);

    // utils.logHelper(buyTokens.logs, 'LogBondingCurve');
    const endBalance = await instance.balanceOf(owner.address);
    const amountBought =
      endBalance.toNumber() / 10 ** decimals -
      startBalance.toNumber() / 10 ** decimals;
    expect(Math.abs(amountBought - amount)).lessThanOrEqual(
      1,
      "able to buy tokens"
    );
  });

  // TODO test that correct amount gets sent back
  it("should be able to sell tokens", async () => {
    const amount = await instance
      .balanceOf(owner.address)
      .then((amt) => amt.toNumber());
    const sellAmount = Math.floor(amount / 2);

    const p = await getRequestParams(amount);
    const saleReturn = await instance.calculateSaleReturn(
      p.supply,
      p.poolBalance,
      solRatio,
      sellAmount
    );

    const contractBalance = await waffle.provider.getBalance(instance.address);

    const sell = await instance
      .sell(sellAmount.valueOf())
      .then((resp) => resp.wait());
    console.log("sellTokens gas ", sell.gasUsed);
    // utils.logHelper(sell.logs, 'LogBondingCurve');

    const endContractBalance = await waffle.provider.getBalance(
      instance.address
    );
    expect(saleReturn.toNumber()).to.equal(
      contractBalance.toNumber() - endContractBalance.toNumber(),
      "contract change should match salre return"
    );

    const endBalance = await instance.balanceOf(owner.address);
    expect(
      Math.abs(endBalance.toNumber() - (amount - sellAmount))
    ).lessThanOrEqual(10 ** 17, "balance should be correct");
  });

  // TODO test that correct amount gets sent back
  it("should be able to sell all", async () => {
    const amount = await instance.balanceOf(owner.address);

    const contractBalance = await waffle.provider.getBalance(instance.address);

    const p = await getRequestParams(amount.toNumber());
    const saleReturn = await instance.calculateSaleReturn(
      p.supply,
      p.poolBalance,
      solRatio,
      amount
    );

    const sell = await instance
      .sell(amount.toNumber())
      .then((resp) => resp.wait());
    console.log("sellTokens gas ", sell.gasUsed);
    // utils.logHelper(sell.logs, 'LogBondingCurve');

    const endContractBalance = await waffle.provider.getBalance(
      instance.address
    );
    expect(saleReturn.toNumber()).equal(
      contractBalance.toNumber() - endContractBalance.toNumber(),
      "contract change should match salre return"
    );

    const endBalance = await instance.balanceOf(owner.address);
    expect(endBalance.toNumber()).equal(0, "balance should be 0 tokens");
  });

  it("should throw when attempting to buy with gas price higher than the universal limit", async () => {
    try {
      await instance.buy({ gasPrice: gasPriceBad, value: 10 ** 18 });
      assert(false, "didn't throw");
    } catch (error) {
      return ensureException(error);
    }
    return true;
  });
});
