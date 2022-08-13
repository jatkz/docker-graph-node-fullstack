import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { SimpleCurveFormula } from "../typechain";

describe("SimpleCurveFormula", () => {
  let curveFormula: SimpleCurveFormula;

  beforeEach(async () => {
    const CF = await ethers.getContractFactory("SimpleCurveFormula");
    curveFormula = await CF.deploy();
    await curveFormula.deployed();
  });

  it("calculateBuyReturn", async () => {
    const [tokens, cost] = await curveFormula.calculateBuyReturn(0, 500);

    expect(tokens).to.equal(31);
    expect(cost).to.equal(480);
  });

  it("calculateSaleReturn", async () => {
    const reward = await curveFormula.calculateSaleReturn(31, 15);

    expect(reward).to.equal(352);
  });

  it("calculateBuyCost", async () => {
    const cost = await curveFormula.calculateBuyCost(0, 15);

    expect(cost).to.equal(112);
  });

  it("calculateSaleCost", async () => {
    const tokens = await curveFormula.calculateSaleCost(31, 400);

    expect(tokens).to.equal(19);
  });
});
