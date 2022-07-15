import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { contractAddress } from "../bc-config.local.31337";
import { BondingCurveUniversal__factory } from "../typechain/factories/BondingCurveUniversal__factory";

task("sample-trades", "Run some sample trades").setAction(
  async (_, hre): Promise<void> => {
    console.log(hre.network.name);
    if (hre.network.name != "localhost") return;
    /* these two lines deploy the contract to the network */
    const accounts = await hre.ethers.getSigners();
    // const bc = new hre.ethers.Contract(contractAddress, BC.abi);

    const receipt = await BondingCurveUniversal__factory.connect(
      contractAddress,
      accounts[0]
    )
      .buy({
        // value: hre.ethers.utils.parseEther("2"),
        value: 20000,
        // gasPrice: 1000000000,
        gasLimit: 300000,
      })
      .then((transaction) => {
        return transaction.wait();
      });

    const supply = await BondingCurveUniversal__factory.connect(
      contractAddress,
      accounts[0]
    ).totalSupply({
      // gasPrice: 1000000000,
      gasLimit: 300000,
    });

    console.log("Supply", supply.toNumber());
  }
);
