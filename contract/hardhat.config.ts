import "@nomicfoundation/hardhat-toolbox-viem";
import "solidity-coverage";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        runs: 1000,
        enabled: true,
      },
      viaIR: true,
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  networks: {
    "blast-sepolia": {
      url: "https://sepolia.blast.io",
      accounts: process.env.WALLET_KEY ? [process.env.WALLET_KEY] : [],
      gasPrice: 20000000,
    },
    "arbitrum-sepolia": {
      url: "https://sepolia-rollup.arbitrum.io/rpc", // Fixed RPC URL
      accounts: process.env.WALLET_KEY ? [process.env.WALLET_KEY] : [],
    }
  },
  etherscan: {
    apiKey: {
      "blast-sepolia": process.env.BLAST_SCAN_API_KEY || "",
      "arbitrum-sepolia": process.env.ARBISCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "blast-sepolia",
        chainId: 168587773,
        urls: {
          apiURL: "https://api-sepolia.blastscan.io/api",
          browserURL: "https://sepolia.blastscan.io",
        },
      },
      {
        network: "arbitrum-sepolia", 
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      }
    ],
  },
  defaultNetwork: "hardhat",
};

export default config;