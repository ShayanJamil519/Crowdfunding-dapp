require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();

const PRIVATE_KEY1 = process.env.PRIVATE_KEY1;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;
const PRIVATE_KEY3 = process.env.PRIVATE_KEY3;
const PRIVATE_KEY4 = process.env.PRIVATE_KEY4;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },

    sepolia: {
      chainId: 5,
      blockConfirmations: 6,
      url: SEPOLIA_RPC_URL,
      accounts:
        PRIVATE_KEY1 !== undefined &&
        PRIVATE_KEY2 !== undefined &&
        PRIVATE_KEY3 !== undefined &&
        PRIVATE_KEY4 !== undefined
          ? [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4]
          : [],
    },
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    noColors: false,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    address1: {
      default: 1,
    },
    address2: {
      default: 2,
    },
    address3: {
      default: 3,
    },
  },
  // paths: {
  //   sources: "./contracts",
  //   artifacts: "./src/abis",
  // },
  mocha: {
    timeout: 40000,
  },
};
