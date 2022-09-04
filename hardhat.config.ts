import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "./tasks/sample-trades";
import "./tasks/deploy-bc";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  console.log("Accounts for " + hre.network.name + " network.");
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
    const bal = await account.getBalance();
    console.log("Balance: ", bal);
  }
});

if (!process.env.MUMBAI_PRIVATE_KEY) throw new Error("mumbai key missing");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: [
        process.env.MUMBAI_PRIVATE_KEY,
        process.env.TEST_KEY_PRIV_1 || "",
        process.env.TEST_KEY_PRIV_2 || "",
        process.env.TEST_KEY_PRIV_3 || "",
        process.env.TEST_KEY_PRIV_4 || "",
      ],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY !== undefined ? [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY] : [],
    },
    // polygon: {
    //   url: "https://polygon-rpc.com/",
    //   accounts: [process.env.pk]
    // }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
