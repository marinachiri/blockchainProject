require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deployContractsLocally() {
  const [storeOwnerSigner, feesOwnerSigner, user1, user2] = await ethers.getSigners();

  const FeesFactory = await ethers.getContractFactory("Fees");
  const fees = await FeesFactory.connect(feesOwnerSigner).deploy();
  await fees.deployed();
  console.log("Fees contract deployed at: ", fees.address);

  const StoreFactory = await ethers.getContractFactory("Store");
  const store = await StoreFactory.connect(storeOwnerSigner).deploy(fees.address);
  await store.deployed();
  console.log("Store contract deployed at: ", store.address);

  console.log("Contracts deployed locally");
}

deployContractsLocally()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
