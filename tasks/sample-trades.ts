import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { contractAddress as localAddress } from "../bc-config.local.31337";
import { contractAddress as mumbaiAddress } from "../bc-config.mumbai.undefined";
import { ContractReceipt, ContractTransaction } from "ethers";

interface TradeStep {
  order: "buy" | "sell";
  value: number;
  addressIndex: number;
}

const trade_steps: TradeStep[] = [
  { addressIndex: 0, order: "buy", value: 25 },
  { addressIndex: 1, order: "buy", value: 55 },
  { addressIndex: 2, order: "buy", value: 95 },
  { addressIndex: 0, order: "buy", value: 150 },
  { addressIndex: 0, order: "sell", value: 5 },
  { addressIndex: 3, order: "buy", value: 130 },
  { addressIndex: 4, order: "buy", value: 170 },
  { addressIndex: 1, order: "sell", value: 4 },
  { addressIndex: 0, order: "buy", value: 250 },
  { addressIndex: 3, order: "buy", value: 220 },
  { addressIndex: 2, order: "buy", value: 230 },
  { addressIndex: 0, order: "sell", value: 5 },
  { addressIndex: 0, order: "buy", value: 150 },
  { addressIndex: 2, order: "buy", value: 350 },
  { addressIndex: 0, order: "buy", value: 360 },
  { addressIndex: 1, order: "buy", value: 390 },
  { addressIndex: 3, order: "sell", value: 8 },
  { addressIndex: 0, order: "buy", value: 450 },
  { addressIndex: 0, order: "buy", value: 470 },
  { addressIndex: 2, order: "buy", value: 420 },
  { addressIndex: 0, order: "sell", value: 10 },
  { addressIndex: 0, order: "sell", value: 5 },
  { addressIndex: 3, order: "buy", value: 450 },
  { addressIndex: 0, order: "buy", value: 650 },
  { addressIndex: 2, order: "buy", value: 390 },
  { addressIndex: 0, order: "sell", value: 9 },
  { addressIndex: 4, order: "buy", value: 450 },
  { addressIndex: 3, order: "buy", value: 950 },
  { addressIndex: 0, order: "buy", value: 550 },
  { addressIndex: 0, order: "buy", value: 850 },
  { addressIndex: 4, order: "buy", value: 650 },
  { addressIndex: 2, order: "sell", value: 8 },
  { addressIndex: 0, order: "buy", value: 1500 },
  { addressIndex: 3, order: "buy", value: 1900 },
  { addressIndex: 0, order: "sell", value: 7 },
  { addressIndex: 1, order: "buy", value: 1800 },
  { addressIndex: 2, order: "buy", value: 2500 },
  { addressIndex: 0, order: "sell", value: 25 },
  { addressIndex: 4, order: "sell", value: 13 },
  { addressIndex: 1, order: "sell", value: 15 },
];

task("sample-trades", "Run some sample trades").setAction(async (_, hre): Promise<void> => {
  console.log(hre.network.name);
  let contractAddress: string;
  if (hre.network.name == "mumbai") {
    contractAddress = mumbaiAddress;
  } else if (hre.network.name == "hardhat") {
    contractAddress = localAddress;
  } else {
    return;
  }
  // if (hre.network.name != "localhost") return;
  /* these two lines deploy the contract to the network */
  const accounts = await hre.ethers.getSigners();

  for (const trade of trade_steps) {
    const bc = await hre.ethers.getContractAt("SimpleBondingCurve", contractAddress, accounts[trade.addressIndex]);
    let resp: ContractReceipt;

    if (trade.order == "buy") {
      resp = await bc
        .buy({
          value: trade.value,
          gasPrice: 800000000,
        })
        .then((resp) => {
          console.log("resp", resp);
          return resp;
        })
        .then((resp: ContractTransaction) => resp.wait());
    } else {
      resp = await bc
        .sell(trade.value, {
          gasPrice: 800000000,
        })
        .then((resp) => {
          console.log("resp", resp);
          return resp;
        })
        .then((resp: ContractTransaction) => resp.wait());
    }

    console.log(resp);
  }
});
