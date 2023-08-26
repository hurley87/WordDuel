import '@nomicfoundation/hardhat-toolbox';

const dotenv = require('dotenv');

dotenv.config();

const base = process.env.ETHERSCAN_API_KEY as string;

const config: any = {
  solidity: '0.8.19',
  etherscan: {
    apiKey: {
      base,
    },
  },
  networks: {
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    'base-local': {
      url: 'http://localhost:8545',
      accounts: [process.env.WALLET_KEY as string],
    },
  },
};

export default config;
