export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export const BLOCK_EXPLORER_URL =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || '';

export const MANAGER_ADDRESS = process.env.NEXT_PUBLIC_MANAGER_ADDRESS || '';
export const RISK_ENGINE_ADDRESS =
  process.env.NEXT_PUBLIC_RISK_ENGINE_ADDRESS || '';

export const LINK_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_LINK_TOKEN_ADDRESS || '';
export const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '';

export const WALLET_ADDRESS_KEY = 'walletAddress';

// Polygon Mumbai
export const CHAIN_ID = '0x13881';
export const CHAIN_NAME = 'Mumbai Testnet';
export const CHAIN_CURRENCY = 'Mumbai Matic';
export const CHAIN_SYMBOL = 'MATIC';
export const CHAIN_DECIMALS = 18;

export const POLLING_INTERVAL = 15_000;

// 2 ** 256 - 1
export const MAX_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
