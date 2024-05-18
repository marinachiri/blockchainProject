// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
//in contractul fees gestionam taxa fixa de 100 wei pt fiecare tranzactie 
contract Fees is Ownable {
    uint256 private totalFeesCollected;
    uint256 private constant FIXED_FEE = 100; //in wei 
    //event care se emite atunci cand o taxa este trimisa 
    event FeeProcessed(address indexed payer, uint256 amount);

    modifier validFee() {
        console.log("Fee value: ", msg.value);
        require(msg.value > 0, "Fee must be greater than zero");
        _;
    }

    constructor() Ownable(msg.sender) {
        totalFeesCollected = 0;
    }

    function getFixedFee() public pure returns (uint256) {
        return FIXED_FEE;
    }
    //functie externa care transfera taxa catre proprietarul contractului 
    // este o functie external adica este scrisa aici dar folosita in contractul store
    // functiile external sunt functiiile dintr un contract cu proprietatea ca acestea nu sunt folosite in contractul in care a fost creata
    function processFee() external payable validFee() {
        console.log("Processing fee, amount: ", msg.value);
        payable(owner()).transfer(msg.value);
        console.log("Fee processed.");
        totalFeesCollected += msg.value;
        emit FeeProcessed(msg.sender, msg.value);
    }

    function getTotalFees() public view onlyOwner() returns (uint256) {
        return totalFeesCollected;
    }
}
