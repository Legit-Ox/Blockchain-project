import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "./tasks/block-number";



const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  //sepolia
  networks: {
      sepolia: {
        url: process.env.SEPOLIA_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId:11155111,
    },
    localhost:{
      url:"http://localhost:8545",
      chainId:31337

    }
  },
  etherscan:{
    apiKey:process.env.ETHERSCAN_API_KEY
  }
};

export default config;
