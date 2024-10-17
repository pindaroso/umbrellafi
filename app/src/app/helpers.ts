import { MetaMaskInpageProvider } from '@metamask/providers';
import { JsonRpcProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export function concatEthereumAddress(address: string): string {
  if (address.startsWith('0x') && address.length === 42) {
    return `${address.substring(0, 6).replace('x', '✕')}...${address.substring(
      address.length - 4
    )}`;
  } else {
    throw new Error('Invalid Ethereum address format');
  }
}

export const refreshBlock = async (provider: JsonRpcProvider) => {
  try {
    const block = await provider.getBlock('latest');
    if (block?.number) {
      return block.number;
    }
    console.log('could not retrieve latest block');
  } catch (e) {
    console.error(e);
  }
};

export const formatAsset = (name: string) => {
  return name.split('-')[0];
};

export type ETF = {
  token: {
    name: string;
    symbol: string;
    address: string;
  };
  tvl: number;
  fee: number;
  assets: string[];
  weights: number[];
  created: number;
  updated: number;
  performance: {
    expectedAnnualReturn: number | null;
    annualVolatility: number | null;
    sharpeRatio: number | null;
  };
};

export type Asset = {
  name: string;
  symbol: string;
  address: string;
  price: number;
  vol: number;
};
