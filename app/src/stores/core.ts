import { create } from 'zustand';
import { ethers, JsonRpcProvider, ContractTransactionReceipt } from 'ethers';

import {
  RPC_URL,
  POLLING_INTERVAL,
  CHAIN_CURRENCY,
  CHAIN_ID,
  CHAIN_DECIMALS,
  CHAIN_NAME,
  CHAIN_SYMBOL,
  BLOCK_EXPLORER_URL,
  WALLET_ADDRESS_KEY,
  MANAGER_ADDRESS,
  RISK_ENGINE_ADDRESS,
  MAX_AMOUNT,
} from '@/app/constants';
import {
  concatEthereumAddress,
  refreshBlock,
  type ETF,
  type Asset,
} from '@/app/helpers';
import {
  Manager__factory as ManagerFactory,
  Manager,
  RiskEngine__factory as RiskEngineFactory,
  RiskEngine,
  ERC20__factory as ERC20Factory,
} from '@/typechain';

export type Store = {
  blockNumber: null | number;
  blockNumberTimer: null | any;
  etfs: ETF[];
  etfsTimer: null | any;
  etfManager: Manager;
  riskEngine: RiskEngine;
  tokenBalances: Map<string, number>;
  assets: Asset[];
  truncatedAddress: null | string;
  initBlockNumberPolling: () => void;
  initETFPolling: () => void;
  initWallet: () => void;
  fetchTokenBalances: () => Promise<void>;
  fetchAssets: () => Promise<Asset[]>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  fetchETFs: () => Promise<ETF[]>;
  createETF: (etf: ETF) => Promise<ContractTransactionReceipt>;
  deposit: (
    index: number,
    amount: number
  ) => Promise<ContractTransactionReceipt>;
  withdraw: (
    index: number,
    amount: number
  ) => Promise<ContractTransactionReceipt>;
  updateWeights: (index: number) => Promise<ContractTransactionReceipt>;
  fetchPerformance: (symbols: string[]) => Promise<any>;
};

const useStore = create<Store>((set, get) => ({
  etfsTimer: null,
  blockNumberTimer: null,
  blockNumber: null,
  truncatedAddress: null,
  etfManager: ManagerFactory.connect(
    MANAGER_ADDRESS,
    new JsonRpcProvider(RPC_URL)
  ),
  riskEngine: RiskEngineFactory.connect(
    RISK_ENGINE_ADDRESS,
    new JsonRpcProvider(RPC_URL)
  ),
  tokenBalances: new Map(),
  fetchAssets: async () => {
    const { riskEngine, assets: prevAssets } = get();

    const assetsSize = parseInt((await riskEngine.assetsSize()).toString());
    if (prevAssets.length === assetsSize) {
      return prevAssets;
    }

    const indices = Array.from({ length: assetsSize }, (_, index) => index);
    const assets = await Promise.all(
      indices.map(async (index) => {
        const symbol = await riskEngine.getAssetAtIndex(index);
        const address = await riskEngine.assets(symbol);
        return { symbol, address } as Asset;
      })
    );

    return assets;
  },
  fetchTokenBalances: async () => {
    const { assets } = get();

    if (!window.ethereum) {
      console.warn('ethreum is not defined');
      return;
    }
    if (assets.length === 0) {
      console.warn('assets not set');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const balances = await Promise.all(
      assets.map((asset) =>
        ERC20Factory.connect(
          asset.address,
          new JsonRpcProvider(RPC_URL)
        ).balanceOf(signer.address)
      )
    );

    const tokenBalances = new Map<string, number>();
    balances.map((balance, i) => {
      tokenBalances.set(assets[i].symbol, parseInt(balance.toString()));
    });

    set(() => ({ tokenBalances }));
  },
  initWallet: () => {
    const { connectWallet } = get();
    if (localStorage.getItem(WALLET_ADDRESS_KEY)?.length) {
      connectWallet();
    }
  },
  initBlockNumberPolling: async () => {
    const blockNumberTimer = setInterval(async () => {
      const blockNumber = await refreshBlock(new JsonRpcProvider(RPC_URL));
      set(() => ({ blockNumber }));
    }, POLLING_INTERVAL);

    const blockNumber = await refreshBlock(new JsonRpcProvider(RPC_URL));
    set(() => ({ blockNumberTimer, blockNumber }));
  },
  initETFPolling: async () => {
    const { fetchETFs, fetchAssets, fetchTokenBalances } = get();

    const etfsTimer = setInterval(async () => {
      const etfs = await fetchETFs();
      set(() => ({ etfs }));
    }, POLLING_INTERVAL);

    const etfs = await fetchETFs();
    set(() => ({ etfsTimer, etfs }));

    const assets = await fetchAssets();
    set(() => ({ assets }));

    await fetchTokenBalances();
  },
  connectWallet: async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (chainId !== CHAIN_ID) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID }],
          });
        }
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: CHAIN_ID,
                  chainName: CHAIN_NAME,
                  rpcUrls: [RPC_URL],
                  nativeCurrency: {
                    name: CHAIN_CURRENCY,
                    symbol: CHAIN_SYMBOL,
                    decimals: CHAIN_DECIMALS,
                  },
                  blockExplorerUrls: [BLOCK_EXPLORER_URL],
                },
              ],
            });
          } catch (e) {
            console.error(e);
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const truncatedAddress = concatEthereumAddress(signer.address);

      // Connect contract to browser wallet
      const etfManager = ManagerFactory.connect(MANAGER_ADDRESS, signer);

      localStorage.setItem(WALLET_ADDRESS_KEY, signer.address);

      set(() => ({ truncatedAddress, etfManager }));
    } else {
      console.error('MetaMask not installed');
    }
  },
  disconnectWallet: () => {
    localStorage.setItem(WALLET_ADDRESS_KEY, '');

    set(() => ({
      truncatedAddress: null,
      etfManager: ManagerFactory.connect(
        MANAGER_ADDRESS,
        new JsonRpcProvider(RPC_URL)
      ),
    }));
  },
  fetchETFs: async () => {
    const { etfManager, riskEngine, etfs: prevETFs } = get();

    const etfsSize = await etfManager.etfsSize();
    if (parseInt(etfsSize.toString()) === prevETFs.length) {
      return prevETFs;
    }

    const tokens = await Promise.all(
      Array.from(
        { length: parseInt(etfsSize.toString()) },
        (_, index) => index
      ).map((n) => etfManager.getETFAtIndex(n))
    );

    const etfOperations = tokens.map(async (token) => {
      const [etfs, assets, rawWeights, totalSupply] = await Promise.all([
        etfManager.etfs(token),
        etfManager.getETFAssets(token),
        riskEngine.getETFWeights(token),
        ERC20Factory.connect(token, new JsonRpcProvider(RPC_URL)).totalSupply(),
      ]);
      const weights = rawWeights.map((weight) => parseInt(weight.toString()));
      return { etfs, assets, weights, totalSupply };
    });
    const etfData = await Promise.all(etfOperations);

    const rawETFs = etfData.map((data) => data.etfs);
    const etfAssets = etfData.map((data) => data.assets);
    const weights = etfData.map((data) => data.weights);
    const totalSupplies = etfData.map((data) => data.totalSupply);

    const performances = await Promise.all(
      rawETFs.map((_, i) =>
        fetch(`/api/riskengine/assets?assets=${etfAssets[i].join(',')}`).then(
          (response) => response.json()
        )
      )
    );

    const etfs = etfAssets.map((assets, i) => {
      return {
        assets,
        weights: weights[i],
        token: {
          name: '',
          symbol: '',
          address: tokens[i],
        },
        tvl: parseInt(totalSupplies[i].toString()), // TODO: Add decimals
        fee: parseInt(rawETFs[i][0].toString()),
        created: parseInt(rawETFs[i][1].toString()),
        updated: parseInt(rawETFs[i][2].toString()),
        performance: performances[0],
      } as ETF;
    });

    return etfs;
  },
  createETF: async (etf: ETF) => {
    const { etfManager: umbrellaContract } = get();
    const result = await umbrellaContract.createETF(
      etf.token.symbol,
      etf.token.name,
      etf.fee,
      etf.assets
    );
    const receipt = await result.wait();
    if (!receipt) {
      throw new Error('Transaction failed');
    }
    return receipt;
  },
  deposit: async (index: number, amount: number) => {
    const { etfManager, assets } = get();

    const asset = assets.find((asset) => {
      return asset.symbol === 'USDC-USD.CC';
    });

    if (asset === undefined) {
      throw new Error('could not find USDC');
    }
    if (window.ethereum === undefined) {
      throw new Error('ethereum is undefined');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const usdc = ERC20Factory.connect(asset.address, signer);

    // TODO: Check approval amount first
    const approvalResult = await usdc.approve(MANAGER_ADDRESS, MAX_AMOUNT);
    const approvalReceipt = await approvalResult.wait();

    const result = await etfManager.deposit(index, amount);
    const receipt = await result.wait();
    if (!receipt) {
      throw new Error('Transaction failed');
    }
    return receipt;
  },
  withdraw: async (index: number, amount: number) => {
    const { etfManager } = get();
    const result = await etfManager.withdraw(index, amount);
    const receipt = await result.wait();
    if (!receipt) {
      throw new Error('Transaction failed');
    }
    return receipt;
  },
  updateWeights: async (index: number) => {
    const { etfManager } = get();
    const result = await etfManager.updateWeights(index);
    const receipt = await result.wait();
    if (!receipt) {
      throw new Error('Transaction failed');
    }
    return receipt;
  },
  fetchPerformance: async (assets: string[]) => {
    const result = await fetch(
      `/api/riskengine/assets?assets=${assets.join(',')}`
    );
    return await result.json();
  },
  assets: [],
  etfs: [],
}));

export default useStore;
