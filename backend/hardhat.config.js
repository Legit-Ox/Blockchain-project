require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
const { vars } = require("hardhat/config");
require("dotenv/config");
const ETHERSCAN_API_KEY = vars.get("OKLINK_AMOY_API");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
const { POLYGON_AMOY_RPC, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    polygonAmoy: {
      url: `${POLYGON_AMOY_RPC}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL:
            "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL: "https://www.oklink.com/polygonAmoy",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};
