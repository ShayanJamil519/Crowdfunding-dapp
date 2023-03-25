const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Setting Accounts
  [deployer, address1, address2, address3] = await ethers.getSigners();
  const PROJECT_TAX = 10;

  // Deploying BoostMeUp Contract
  const BoostMeUp = await ethers.getContractFactory("BoostMeUp");
  const boostMeUp = await BoostMeUp.deploy(PROJECT_TAX);
  await boostMeUp.deployed();

  const address = JSON.stringify({ address: boostMeUp.address }, null, 4);
  fs.writeFile("./src/abis/contractAddress.json", address, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(
      "----------------------------------------------------------------------------"
    );
    console.log("Deployed BoostMeUp Contract at: ", boostMeUp.address);

    console.log(
      "----------------------------------------------------------------------------"
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
