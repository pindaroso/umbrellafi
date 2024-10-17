// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from 'forge-std/Script.sol';

import {RiskEngine} from '../src/RiskEngine.sol';
import {MockERC20} from '../src/mocks/MockERC20.sol';

contract AddAssetsScript is Script {
  function run() public {
    vm.startBroadcast();

    RiskEngine riskEngine = RiskEngine(vm.envAddress('RISK_ENGINE_ADDRESS'));
    address maker = vm.envAddress('TAKER_ADDRESS');

    uint256 chainId = vm.envUint('CHAIN_ID');

    if (chainId == 80001) {
      // For testing purposes
      MockERC20 usdc = new MockERC20('USD Coin', 'USDC');
      MockERC20 btc = new MockERC20('Bitcoin', 'BTC');
      MockERC20 eth = new MockERC20('Ethereum', 'ETH');
      MockERC20 matic = new MockERC20('Matic', 'MATIC');

      usdc.mint(maker, 100e18);
      btc.mint(maker, 100e18);
      eth.mint(maker, 100e18);
      matic.mint(maker, 100e18);

      address manager = vm.envAddress('MANAGER_ADDRESS');
      usdc.approve(address(manager), 2 ** 256 - 1);

      riskEngine.addAsset('USDC-USD.CC', address(usdc));
      riskEngine.addAsset('ETH-USD.CC', address(eth));
      riskEngine.addAsset('BTC-USD.CC', address(btc));
      riskEngine.addAsset('MATIC-USD.CC', address(matic));
    } else {
      riskEngine.addAsset(
        'USDC-USD.CC',
        0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
      );
      riskEngine.addAsset(
        'BTC-USD.CC',
        0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6
      );
      riskEngine.addAsset(
        'ETH-USD.CC',
        0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8
      );
      riskEngine.addAsset(
        'MATIC-USD.CC',
        0x0000000000000000000000000000000000001010
      );
    }

    vm.stopBroadcast();
  }
}
