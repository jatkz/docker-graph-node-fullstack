require("dotenv").config();
import { ethers } from "hardhat";
import contract from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { AbiItem } from "web3-utils";
import { contractAddress as localContractAddress } from "../config.local.31337";

// used the alchemy web3 utils to get a feel for how they are used.

async function main() {
  const network = await ethers.provider.getNetwork();

  let contractAddress: string = localContractAddress;
  let API_URL: string = "http://127.0.0.1:8545";
  let PUBLIC_KEY: string = process.env.LOCAL_PUBLIC_KEY || "";
  let PRIVATE_KEY: string = process.env.LOCAL_PRIVATE_KEY || "";
  if (network.name == "mumbai") {
    API_URL = process.env.MUMBAI_ALCHEMY_URL || "";
    PUBLIC_KEY = process.env.MUMBAI_PUBLIC_KEY || "";
    PRIVATE_KEY = process.env.MUMBAI_PUBLIC_KEY || "";
    throw new Error("contract address not added");
  }

  const web3 = createAlchemyWeb3(API_URL);
  const nftContract = new web3.eth.Contract(
    contract.abi as AbiItem[],
    contractAddress
  );

  async function mintNFT(tokenURI: string) {
    if (!PUBLIC_KEY) throw new Error("Public key missing");
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
    console.log("nonce", nonce);
    const estimatedGas = await web3.eth.estimateGas({
      to: contractAddress,
      nonce: nonce,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    });
    console.log("estimated gas", estimatedGas);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gas price", gasPrice);
    //the transaction
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: estimatedGas,
      gasPrice: gasPrice,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    if (!PRIVATE_KEY) throw new Error("Private key missing");
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    await signPromise
      .then(async (signedTx) => {
        if (!signedTx.rawTransaction)
          throw new Error("signedTx raw transaction was undefined");
        await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              );
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(" Promise failed:", err);
      });
  }

  await mintNFT("ipfs://QmRKHH9Ym3pYfD3QfxxiDJr3H9aSvzYvCm546j9wW7X9CS");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
