require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://1rpc.io/sepolia",
      gas: "auto",
      accounts: [ "c6a0fef18e6199378f1d97e1343526f944b51baaebe800c017ea7e862bcc358f",  
      "305dc69311ee33d74b3b0dc8776e0c95a04913ebdbc8c8d285d4fbd48b592e14",
      "3fa2e93b2ec4a73e2328bf5b0290d34471a7c8c955701cd49d38db15ae7d5deb",
      "9aa6af4246f0b7ad0feffdb4fe8eaf2a1649299d016a732f6c528b387b4e8ff2"
        
      ],
    },
  },
  defaultNetwork: "sepolia",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
};
