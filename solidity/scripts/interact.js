require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interactWithContracts() {
  const storeOwnerAddress = "0x852ebfB1044f188A5623fA75bBFCF6Fef9E45c16";
  const feesOwnerAddress = "0x21B271339172422235743aBB774fDd6D99651a2A";
  const user1Address = "0xBcd4Ef53563F9535d7147c001E90570F700A7E57";
  const user2Address = "0x66fCaE72b33B25B9FaF7368a49AA58AB56Dfce83";

  const storeOwnerSigner = ethers.provider.getSigner(storeOwnerAddress);
  const feesOwnerSigner = ethers.provider.getSigner(feesOwnerAddress);
  const user1 = ethers.provider.getSigner(user1Address);
  const user2 = ethers.provider.getSigner(user2Address);

  let deployedFeesAddress = "0xb817b2282AA32600AAB004917Cf9bB2d5AB35a29";
  let fees = await ethers.getContractAt("Fees", deployedFeesAddress);

  let deployedStoreAddress = "0x69fD8449255F046C3e9f1E8b18BeEf2dEf225045";
  let store = await ethers.getContractAt("Store", deployedStoreAddress);

  let amount1 = ethers.utils.parseUnits("1", 10); // 10^10 wei
  let amount2 = ethers.utils.parseUnits("3", 11); // 3 * 10^11 wei

  let addItemTx = await store.addItem("Item 1", 4, amount1);
  await addItemTx.wait();
  console.log("Item 1 added");

  let addItem2Tx = await store.addItem("Item 2", 2, amount2);
  await addItem2Tx.wait();
  console.log("Item 2 added");

  let items = await store.getItems();
  console.log("Items: ", items);

  let totalPriceFor2Item0 = await store.calculateTotalPrice(0, 2);

  let txOptions = {
    value: totalPriceFor2Item0,
  };

  console.log("User1 balance before purchase: ", (await user1.getBalance()).toString());
  console.log("Fees owner balance before purchase: ", (await feesOwnerSigner.getBalance()).toString());

  let buyItemTx = await store.connect(user1).purchaseItem(0, 2, txOptions);
  await buyItemTx.wait();
  console.log("Item purchased");

  console.log("User1 balance after purchase: ", (await user1.getBalance()).toString());
  console.log("Fees owner balance after purchase: ", (await feesOwnerSigner.getBalance()).toString());

  let totalFees = await fees.connect(feesOwnerSigner).getTotalFees();
  console.log("Total fees collected: ", totalFees.toString());
}

interactWithContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
