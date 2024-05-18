import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { toast } from "react-toastify";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const feesContractAddress = "0xD91973E6b4a6E166Bb11A442D314bdaCf2246E05";
const storeContractAddress = "0x44DC67db97abCD87b3c84968CDFd3e00D2B8eC3d";

const feesContractAbi = [
  "function getFixedFee() public pure returns (uint256)",
  "function getTotalFees() public view returns (uint256)",
];

const feesContract = new ethers.Contract(
  feesContractAddress,
  feesContractAbi,
  provider
);

const storeContractAbi = [
  "function compareStrings(string memory a, string memory b) internal pure returns (bool)",
  "function increaseStock(uint256 itemId, uint256 quantity) public",
  "function decreaseStock(uint256 itemId, uint256 quantity) public",
  "function updatePrice(uint256 itemId, uint256 price) public",
  "function purchaseItem(uint256 itemId, uint256 quantity) public payable",
  "function applyFee() public",
  "function getCustomers() public view returns (address[] memory)",
  "function getTotalRevenue() public view returns (uint256)",
  "function getTopCustomer() public view returns (address)",
  "function addItem(string memory name, uint256 quantity, uint256 price) public",
  "function removeItem(uint256 itemId) public",
  "function getItem(uint256 itemId) public view returns (string memory, uint256, uint256)",
  "function getInventory() public view returns (uint256[] memory)",
  "function getItems() public view returns (string[] memory)",
  "function calculateTotalPrice(uint256 itemId, uint256 quantity) public view returns (uint256)",
];

const storeContract = new ethers.Contract(
  storeContractAddress,
  storeContractAbi,
  provider
);

export const MainPage = () => {
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [feeInput, setFeeInput] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [inventoryInput, setInventoryInput] = useState([]);
  const [price, setPrice] = useState(0);
  const [priceInput, setPriceInput] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState("");
  const [topCustomer, setTopCustomer] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [quantityInput, setQuantityInput] = useState("");

  const handleGetTotalFees = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalFees = await feesContract.connect(signer).getTotalFees();
      console.log("Total fees: ", parseInt(totalFees));
      setTotalFees(parseInt(totalFees));
      toast.success("Fees value obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetFixedFee = async () => {
    try {
      const fee = await feesContract.getFixedFee();
      console.log("Fixed Fee: ", parseInt(fee));
      setCalculatedFee(parseInt(fee));
      toast.success("Fixed fee obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to get fixed fee", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleIncreaseStock = async (itemId, quantity) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const increaseStock = await storeContract
        .connect(signer)
        .increaseStock(itemId, quantity);
      console.log("Stock increased: ", increaseStock);
      toast.success("Stock increased successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Item does not exist")) {
        toast.error("Item does not exist!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleDecreaseStock = async (itemId, quantity) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const decreaseStock = await storeContract
        .connect(signer)
        .decreaseStock(itemId, quantity);
      console.log("Stock decreased: ", decreaseStock);
      toast.success("Stock decreased successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Not enough stock")) {
        toast.error("Not enough stock!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleUpdatePrice = async (itemId, price) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const updatePrice = await storeContract
        .connect(signer)
        .updatePrice(itemId, price);
      console.log("Price updated: ", updatePrice);
      toast.success("Price updated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Price must be greater than zero")) {
        toast.error("Price must be greater than zero!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleAddItem = async (name, quantity, price) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const addItem = await storeContract
        .connect(signer)
        .addItem(name, quantity, price);
      console.log("Item added: ", addItem);
      toast.success("Item added successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Item already exists"))
        toast.error("Item already exists!", {
          position: "top-center",
          autoClose: 3000,
        });
      else if (error.message.includes("Value must be greater than zero")) {
        toast.error("Value must be greater than zero!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handlePurchaseItem = async (itemId, quantity) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalPrice = await storeContract.calculateTotalPrice(
        itemId,
        quantity
      );
      await storeContract
        .connect(signer)
        .purchaseItem(itemId, quantity, { value: totalPrice });
      console.log("Item purchased");
      toast.success("Item purchased successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Amount must be greater than zero")) {
        toast.error("Amount must be greater than zero!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (error.message.includes("Not enough stock")) {
        toast.error("Not enough stock!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (error.message.includes("Insufficient balance")) {
        toast.error("Insufficient balance!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Item not purchased", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleGetCustomers = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const customers = await storeContract.connect(signer).getCustomers();
      console.log("Customers: ", customers);
      let uniqueCustomers = [];
      customers.map((customer) => {
        if (!uniqueCustomers.includes(customer)) uniqueCustomers.push(customer);
      });
      setCustomers(uniqueCustomers);
      toast.success("Customers obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetTotalRevenue = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalRevenue = await storeContract
        .connect(signer)
        .getTotalRevenue();
      console.log("Total revenue: ", parseInt(totalRevenue));
      setTotalRevenue(parseInt(totalRevenue));
      toast.success("Total revenue obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetTopCustomer = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const topCustomer = await storeContract.connect(signer).getTopCustomer();
      console.log("Top customer: ", topCustomer);
      setTopCustomer(topCustomer);
      toast.success("Top customer obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetItems = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const items = await storeContract.connect(signer).getItems();
      console.log("Items: ", items);
      setItems(items);
      toast.success("Items obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetInventory = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const inventory = await storeContract.connect(signer).getInventory();
      console.log("Inventory: ", inventory);
      setInventory(inventory);
      toast.success("Inventory obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetAllItemsDetails = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const items = await storeContract.connect(signer).getItems();
      console.log("Items: ", items);
      const itemsLen = items.length;
      const itemDetails = [];
      for (let i = 0; i < itemsLen; i++) {
        const item = await storeContract.connect(signer).getItem(i);
        itemDetails.push(item);
      }
      setItemDetails(itemDetails);
      console.log("Item Details: ", itemDetails);
      toast.success("Item details obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 className="text-align-center">Store Project</h1>
      <h2 style={{ textAlign: "center" }}>Fees Contract</h2>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }} />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetTotalFees}
      >
        Get Total Fees
      </button>
      <p>
        Total fees: <strong>{totalFees}</strong>
      </p>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="btn btn-primary pl-3"
          style={{ marginLeft: "15px" }}
          onClick={() => handleGetFixedFee()}
        >
          Get Fixed Fee
        </button>
      </div>
      <p>
        Fixed Fee: <strong>{calculatedFee}</strong>
      </p>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <h2 style={{ textAlign: "center" }}>Store Contract</h2>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <input
        className="form-control"
        placeholder="Enter name"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="Enter quantity"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <input
        className="form-control"
        placeholder="Enter price"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setPrice(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleAddItem(name, quantity, price)}
      >
        Add Item
      </button>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetItems}
      >
        Get Items Names
      </button>
      <p>
        Items: <strong>{items.join(", ")}</strong>
      </p>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetAllItemsDetails}
      >
        Get Items Details
      </button>
      {itemDetails.length > 0 && (
        <table
          style={{
            width: "40%",
            border: "1px solid black",
            borderCollapse: "collapse",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <tr
            style={{
              border: "1px solid black",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <th
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              Item
            </th>
            <th
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              Stock
            </th>
            <th
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              Price
            </th>
          </tr>
          {itemDetails.map((item) => {
            console.log("Item: ", item);
            return (
              <tr
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  {item[0]}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  {item[1].toString()}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  {item[2].toString()}
                </td>
              </tr>
            );
          })}
        </table>
      )}
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <input
        className="form-control"
        placeholder="Enter item id"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setInventoryInput(parseInt(e.target.value))}
      />
      <input
        className="form-control"
        placeholder="Enter quantity"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setQuantityInput(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleIncreaseStock(inventoryInput, quantityInput)}
      >
        Increase Stock
      </button>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetInventory}
      >
        Get Inventory
      </button>
      <p>
        Inventory: <strong>{inventory.join(", ")}</strong>
      </p>
      <input
        className="form-control"
        placeholder="Enter item id"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setInventoryInput(parseInt(e.target.value))}
      />
      <input
        className="form-control"
        placeholder="Enter quantity"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setQuantityInput(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleDecreaseStock(inventoryInput, quantityInput)}
      >
        Decrease Stock
      </button>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <input
        className="form-control"
        placeholder="Enter item id"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setInventoryInput(parseInt(e.target.value))}
      />
      <input
        className="form-control"
        placeholder="Enter price"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setPriceInput(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleUpdatePrice(inventoryInput, priceInput)}
      >
        Update Price
      </button>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <input
        className="form-control"
        placeholder="Enter item id"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setItemInput(parseInt(e.target.value))}
      />
      <input
        className="form-control"
        placeholder="Enter quantity"
        style={{ width: "200px", marginBottom: "10px" }}
        onChange={(e) => setQuantityInput(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handlePurchaseItem(itemInput, quantityInput)}
      >
        Purchase Item
      </button>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetCustomers}
      >
        Get Customers
      </button>
      <p>
        Customers: <strong>{customers.join(", ")}</strong>
      </p>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetTotalRevenue}
      >
        Get Total Revenue
      </button>
      <p>
        Total Revenue: <strong>{totalRevenue}</strong>
      </p>
      <hr
        style={{
          borderTop: "8px solid #000",
          borderRadius: "5px",
          paddingBottom: "20px",
          width: "15%",
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetTopCustomer}
      >
        Get Top Customer
      </button>
      <p>
        Top Customer: <strong>{topCustomer}</strong>
      </p>
    </div>
  );
};
