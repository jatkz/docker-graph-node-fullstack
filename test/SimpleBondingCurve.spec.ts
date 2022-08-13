import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { SimpleBondingCurve } from "../typechain";

describe("SimpleBondingCurve", () => {
  let bondingCurve: SimpleBondingCurve;

  beforeEach(async () => {
    const BC = await ethers.getContractFactory("SimpleBondingCurve");
    bondingCurve = await BC.deploy();
    await bondingCurve.deployed();
  });

  it("Should Buy", async () => {
    const value = 500;
    const rec = await bondingCurve
      .buy({
        value: value,
        gasPrice: 800000000,
      })
      .then((resp) => resp.wait());

    const poolbal = await bondingCurve.poolBalance().then((d) => d.toNumber());

    expect(poolbal).to.be.greaterThan(0);

    const supply = await bondingCurve.totalSupply().then((d) => d.toNumber());

    expect(supply).to.be.greaterThan(0);

    const [owner] = await ethers.getSigners();
    const addressbal = await bondingCurve
      .balanceOf(owner.address)
      .then((d) => d.toNumber());

    expect(addressbal).to.be.greaterThan(0);
  });

  it("Should Sell", async () => {
    const value = 500;
    const rec = await bondingCurve
      .buy({
        value: value,
        gasPrice: 800000000,
      })
      .then((resp) => resp.wait());

    const [owner] = await ethers.getSigners();
    const bal = await bondingCurve
      .balanceOf(owner.address)
      .then((d) => d.toNumber());

    expect(bal).to.greaterThan(0);

    const sellRec = await bondingCurve
      .sell(bal, {
        gasPrice: 800000000,
      })
      .then((resp) => resp.wait());

    const balAfter = await bondingCurve
      .balanceOf(owner.address)
      .then((d) => d.toNumber());

    expect(balAfter).to.equal(0);
  });

  it("Should Set Gas Price", async () => {
    const maxGasPrice = await bondingCurve.gasPrice().then((d) => d.toNumber());
    const newGasPrice = 5000000;
    const rec = await bondingCurve
      .setGasPrice(newGasPrice)
      .then((res) => res.wait());
    const newPrice = await bondingCurve.gasPrice().then((d) => d.toNumber());
    expect(newPrice).to.equal(newGasPrice);
  });

  it("Should Revert gas price that is too high", async () => {
    const value = 500;
    const maxGasPrice = await bondingCurve.gasPrice().then((d) => d.toNumber());
    try {
      const rec = await bondingCurve
        .buy({
          value: value,
          gasPrice: maxGasPrice * 2, // should fail due to gas limit
        })
        .then((resp) => resp.wait());
    } catch (err: any) {
      const e: string = err.toString();
      console.log(e);
      expect(e.includes("gas price req failed")).to.be.true;
    }
  });
});
