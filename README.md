# Setting up the Project

```
# Step 1 Run the node
npx hardhat node --hostname 0.0.0.0

# Step 2 Deploy the smart contract
npx hardhat run --network localhost ./scripts/deploy-bc.ts

# Step 3 Then run the sample trades
npx hardhat sample-trades --network localhost

# Step 4 run the graph node in the subgraph folder
cd subgraph
docker-compose up

# Step 5 install subgraph deps
graph codegen
graph build

# Step 6 deploy the subgraph
graph create jaredtokuz/bondingcurve --node http://0.0.0.0:8020
graph deploy jaredtokuz/bondingcurve --ipfs http://127.0.0.1:5001 --node http://0.0.0.0:8020

# If you need to redeploy
graph remove jaredtokuz/bondingcurve -g http://0.0.0.0:8020


# Inside the graph node project EX:
# create graph node directory example project template *(Starting Out)
graph init --from-example jaredtokuz/bondingcurve ./subgraph
cd subgraph
```

# TODO

1. Resetup the new graph schema with the new smart contract
1. Get graph node to start up and deploy the graph schema

# Set up with mumbai test network

1. Follow this for meta mask set up and faucet => https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
