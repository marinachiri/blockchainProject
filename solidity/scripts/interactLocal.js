require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interactLocally() {
  const [storeOwnerSigner, feesOwnerSigner, user1, user2] = await ethers.getSigners();

  console.log("Store owner address: ", storeOwnerSigner.address);
  console.log("Fees owner address: ", feesOwnerSigner.address);
  console.log("User1 address: ", user1.address);
  console.log("User2 address: ", user2.address);

  let deployedFeesAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
  let fees = await ethers.getContractAt("Fees", deployedFeesAddress);

  let deployedStoreAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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

interactLocally()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
