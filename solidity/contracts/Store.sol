// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;
import "hardhat/console.sol";
import "./Fees.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Store is Ownable {
    uint256[] public inventory;
    Fees feesContract;
    uint256[] public itemPrices;
    uint256 totalRevenue;
    address[] public customers;
    string[] public itemList;
    mapping(address => uint256) public customerSpent;

    modifier validAmount(uint256 amount) {
        console.log("Amount: ", amount);
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier validPrice(uint256 price) {
        require(price > 0, "Price must be greater than zero");
        _;
    }

    modifier sufficientStock(uint256 itemId, uint256 quantity) {
        require(inventory[itemId] >= quantity, "Not enough stock");
        _;
    }

    modifier validItem(uint256 itemId) {
        require(inventory.length > itemId, "Item does not exist");
        _;
    }

    modifier enoughBalance(uint256 itemId, uint256 quantity) {
        require(
            msg.sender.balance >= itemPrices[itemId] * quantity,
            "Insufficient balance"
        );
        _;
    }

    modifier itemExists(uint256 itemId) {
        require(inventory[itemId] > 0, "Item does not exist");
        _;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    modifier itemAlreadyExists(string memory name) {
        bool exists = false;
        for (uint256 i = 0; i < itemList.length; i++) {
            if (compareStrings(itemList[i], name)) {
                exists = true;
                break;
            }
        }
        require(!exists, "Item already exists");
        _;
    }

    event StockIncreased(uint256 indexed itemId, uint256 quantity);
    event StockDecreased(uint256 indexed itemId, uint256 quantity);
    event PriceUpdated(uint256 indexed itemId, uint256 price);
    event ItemAdded(uint256 indexed itemId, uint256 quantity);
    event ItemPurchased(address buyer, uint256 indexed itemId, uint256 quantity);

    constructor(Fees _feesContract) Ownable(msg.sender) {
        feesContract = Fees(_feesContract);
    }

    function increaseStock(uint256 itemId, uint256 quantity) public onlyOwner validItem(itemId) {
        inventory[itemId] += quantity;
        emit StockIncreased(itemId, quantity);
    }

    function decreaseStock(uint256 itemId, uint256 quantity) public onlyOwner sufficientStock(itemId, quantity) {
        inventory[itemId] -= quantity;
        emit StockDecreased(itemId, quantity);
    }

    function updatePrice(
        uint256 itemId,
        uint256 price
    ) public onlyOwner validPrice(price) {
        itemPrices[itemId] = price;
        emit PriceUpdated(itemId, price);
    }

    function purchaseItem(
        uint256 itemId,
        uint256 quantity
    )
        public
        payable
        validAmount(quantity)
        sufficientStock(itemId, quantity)
        enoughBalance(itemId, quantity)
    {
        console.log("Item ID: ", itemId);
        uint256 totalCost = itemPrices[itemId] * quantity;
        inventory[itemId] -= quantity;
        totalRevenue += totalCost;
        console.log("Before transfer: ");
        console.log("Total Cost: ", msg.value);
        console.log("Sender balance: ", msg.sender.balance);
        console.log("Owner balance: ", owner().balance);

        payable(address(this)).transfer(msg.value);
        console.log("After transfer: ");
        customers.push(msg.sender);
        customerSpent[msg.sender] += totalCost;
        applyFee();
        
        emit ItemPurchased(msg.sender, itemId, quantity);
    }

    function applyFee() public {
        uint256 feeAmount = feesContract.getFixedFee();
        console.log("Fee Amount: ", feeAmount);
        feesContract.processFee{value: feeAmount}();
    }

    receive() external payable {
        console.log("Received: ", msg.value);
    }

    function getCustomers() public view onlyOwner() returns (address[] memory) {
        return customers;
    }

    function getTotalRevenue() public view onlyOwner() returns (uint256) {
        return totalRevenue;
    }

    function getTopCustomer() public view onlyOwner() returns (address) {
        uint256 maxSpent = 0;
        address topCustomer;
        for (uint256 i = 0; i < customers.length; i++) {
            if (customerSpent[customers[i]] > maxSpent) {
                maxSpent = customerSpent[customers[i]];
                topCustomer = customers[i];
            }
        }
        return topCustomer;
    }

    function addItem(
        string memory name,
        uint256 quantity,
        uint256 price
    ) public onlyOwner itemAlreadyExists(name) {
        inventory.push(quantity);
        itemPrices.push(price);
        itemList.push(name);
        emit ItemAdded(inventory.length - 1, quantity);
    }

    function removeItem(uint256 itemId) public onlyOwner {
        inventory[itemId] = 0;
        itemPrices[itemId] = 0;
    }

    function getItem(
        uint256 itemId
    )
        public
        view
        returns (string memory, uint256, uint256)
    {
        return (itemList[itemId], inventory[itemId], itemPrices[itemId]);
    }

    function getInventory() public view onlyOwner() returns (uint256[] memory) {
        return inventory;
    }

    function getItems() public view onlyOwner() returns (string[] memory) {
        return itemList;
    }

    function calculateTotalPrice(
        uint256 itemId,
        uint256 quantity
    ) public view returns (uint256) {
        return itemPrices[itemId] * quantity;
    }
}
