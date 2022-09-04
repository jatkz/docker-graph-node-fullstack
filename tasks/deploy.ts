import { task } from "hardhat/config";
import { writeFileSync } from "fs";
import "@nomiclabs/hardhat-waffle";

task("deploy", "Deploy Greeter contract").setAction(async (_, hre): Promise<void> => {
  /* these two lines deploy the contract to the network */
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("My blog");

  await blog.deployed();
  console.log("Blog deployed to:", blog.address);

  console.log(hre.network.name);

  /* this code writes the contract addresses to a local */
  /* file named config.js that we can use in the app */
  writeFileSync(
    `./config.${hre.network.name}.ts`,
    `
export const contractAddress = "${blog.address}"
export const ownerAddress = "${await blog.signer.getAddress()}"
    `
  );
  writeFileSync(
    `./config.ts`,
    `
export const contractAddress = "${blog.address}"
export const ownerAddress = "${await blog.signer.getAddress()}"
    `
  );
});
