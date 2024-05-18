require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deployContracts() {
  const storeOwnerAddress = "0x852ebfB1044f188A5623fA75bBFCF6Fef9E45c16";
  const feesOwnerAddress = "0x21B271339172422235743aBB774fDd6D99651a2A";

  const storeOwnerSigner = ethers.provider.getSigner(storeOwnerAddress);
  const feesOwnerSigner = ethers.provider.getSigner(feesOwnerAddress);

  const FeesFactory = await ethers.getContractFactory("Fees");
  const fees = await FeesFactory.connect(feesOwnerSigner).deploy();
  await fees.deployed();
  console.log("Fees contract deployed at: ", fees.address);

  const StoreFactory = await ethers.getContractFactory("Store");
  const store = await StoreFactory.connect(storeOwnerSigner).deploy(fees.address);
  await store.deployed();
  console.log("Store contract deployed at: ", store.address);

  console.log("Contracts deployed successfully");
}

deployContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
