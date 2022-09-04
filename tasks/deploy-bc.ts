import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { writeFileSync } from "fs";
import { SimpleBondingCurve } from "../typechain";

task("deploy-bc", "Deploys the simple bonding curve contract", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  const BC = await hre.ethers.getContractFactory("SimpleBondingCurve", accounts[0]);
  const bondingCurve = await BC.deploy();

  await bondingCurve.deployed();
  console.log("Simple Bonding Curve deployed to:", bondingCurve.address);

  writeFileSync(
    `./bc-config.${hre.network.name}.${hre.network.config.chainId}.ts`,
    `export const contractAddress = "${bondingCurve.address}";
    export const ownerAddress = "${await bondingCurve.signer.getAddress()}";
    `
  );
});
