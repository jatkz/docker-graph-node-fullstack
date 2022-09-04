import Wallet from "ethereumjs-wallet";

async function main() {
  for (let index = 0; index < 4; index++) {
    let addressData = Wallet.generate();
    console.log(`Private key = , ${addressData.getPrivateKeyString()}`);
    console.log(`Address = , ${addressData.getAddressString()}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
