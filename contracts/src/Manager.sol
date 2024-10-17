// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from 'openzeppelin-contracts/contracts/token/ERC20/ERC20.sol';
import {Strings} from 'openzeppelin-contracts/contracts/utils/Strings.sol';

import {Vault} from './Vault.sol';
import {RiskEngine} from './RiskEngine.sol';

import {UniswapV3Swap} from './uniswap/UniswapV3Swap.sol';

contract Manager {
  struct ETF {
    string[] assets;
    uint256 fee;
    uint256 created;
    uint256 updated;
  }

  uint256 public etfsSize;
  mapping(address => ETF) public etfs;
  mapping(uint256 => address) public getETFAtIndex;

  RiskEngine public riskEngine;
  uint64 public subscriptionId;

  UniswapV3Swap uniSwap;

  error AssetNotSupported();

  constructor(
    uint64 subId,
    address router,
    bytes32 donId,
    string memory source,
    uint32 gasLimit
  ) {
    riskEngine = new RiskEngine(router, donId, source, gasLimit);
    uniSwap = new UniswapV3Swap();
    subscriptionId = subId;
    etfsSize = 0;
  }

  function createETF(
    string memory symbol,
    string memory name,
    uint256 fee,
    string[] memory assets
  ) public {
    for (uint256 i = 0; i < assets.length; i++) {
      if (riskEngine.assets(assets[i]) == address(0)) {
        revert AssetNotSupported();
      }
    }

    Vault token = new Vault(name, symbol);
    address tokenAddress = address(token);

    getETFAtIndex[etfsSize] = tokenAddress;
    etfs[tokenAddress] = ETF(assets, fee, block.number, block.number);
    etfsSize += 1;

    riskEngine.initializeETFWeights(tokenAddress, assets.length);
  }

  function getETFAssets(address etf) public view returns (string[] memory) {
    return etfs[etf].assets;
  }

  function getETFAssetsAtIndex(
    uint256 etfIndex
  ) public view returns (string[] memory) {
    address tokenAddress = getETFAtIndex[etfIndex];
    ETF storage etf = etfs[tokenAddress];
    return etf.assets;
  }

  function deposit(uint256 etfIndex, uint256 amount) public {
    ERC20 stablecoin = ERC20(riskEngine.assets('USDC-USD.CC'));

    Vault vault = Vault(getETFAtIndex[etfIndex]);
    stablecoin.transferFrom(msg.sender, address(this), amount);
    vault.deposit(amount);

    address etfAddress = getETFAtIndex[etfIndex];
    buyAssets(etfAddress, amount);
  }

  function withdraw(uint256 etfIndex, uint256 amount) public {
    ERC20 stablecoin = ERC20(riskEngine.assets('USDC-USD.CC'));

    Vault vault = Vault(getETFAtIndex[etfIndex]);
    vault.withdraw(amount);

    stablecoin.approve(address(this), amount);
    stablecoin.transferFrom(address(this), msg.sender, amount);
  }

  function buyAssets(address etfAddress, uint256 stablecoinDeposit) public {
    ETF storage etf = etfs[etfAddress];
    uint256[] memory weights = riskEngine.getETFWeights(etfAddress);

    for (uint256 i = 0; i < etf.assets.length; i++) {
      uint256 amountIn = (stablecoinDeposit * weights[i]) / 100;

      ERC20 stablecoin = ERC20(riskEngine.assets('USDC-USD.CC'));
      stablecoin.approve(address(uniSwap), amountIn);

      uniSwap.swapExactInputSingleHop(
        riskEngine.assets('USDC-USD.CC'),
        riskEngine.assets(etf.assets[i]),
        3000,
        amountIn
      );
    }
  }

  function sellAssets(address etfAddress, uint256 stablecoinWithdrawal) public {
    ETF storage etf = etfs[etfAddress];
    uint256[] memory weights = riskEngine.getETFWeights(etfAddress);

    for (uint256 i = 0; i < etf.assets.length; i++) {
      uint256 amountIn = (stablecoinDeposit * weights[i]) / 100;

      ERC20 stablecoin = ERC20(riskEngine.assets('USDC-USD.CC'));
      stablecoin.approve(address(uniSwap), amountIn);

      uniSwap.swapExactInputSingleHop(
        riskEngine.assets('USDC-USD.CC'),
        riskEngine.assets(etf.assets[i]),
        3000,
        amountIn
      );
    }
  }

  /**
   * @notice Calls Chainlink DON which uses the risk engine API to set new asset weights where `args[0]` is
   * the etf index and `args[1]` is the asset index
   */
  function updateWeights(uint256 etfIndex) public {
    address tokenAddress = getETFAtIndex[etfIndex];
    ETF storage etf = etfs[tokenAddress];

    for (uint256 i = 0; i < etf.assets.length; i++) {
      string[] memory args = new string[](2);
      args[0] = Strings.toString(etfIndex);
      args[1] = Strings.toString(i);
      riskEngine.sendRequest(subscriptionId, i, tokenAddress, args);
    }
  }
}
