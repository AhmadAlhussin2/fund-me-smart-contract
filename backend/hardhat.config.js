require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();


const RPC_URL_GOERLI = process.env.RPC_URL_GOERLI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COIN_MARKET_CAP_API = process.env.COIN_MARKET_CAP_API;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    goerli: {
      url: RPC_URL_GOERLI,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
      chainId: 5,
      blockConfirmations: 1
    },
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COIN_MARKET_CAP_API,
  },
  mocha: {
    timeout: 200000,
  }
};
