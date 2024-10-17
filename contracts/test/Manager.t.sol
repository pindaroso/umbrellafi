// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from 'forge-std/Test.sol';

import {ERC20} from 'openzeppelin-contracts/contracts/token/ERC20/ERC20.sol';

import {Vault} from '../src/Vault.sol';
import {RiskEngine} from '../src/RiskEngine.sol';
import {Manager} from '../src/Manager.sol';

import {UniswapV3Swap} from '../src/uniswap/UniswapV3Swap.sol';
import {UniswapV3Liquidity} from '../src/uniswap/UniswapV3Liquidity.sol';
import {UniswapV3Pool} from '../src/uniswap/UniswapV3Pool.sol';

import {IUniswapV3Pool} from '../src/uniswap/interfaces/IUniswapV3Pool.sol';

import {MockERC20} from '../src/mocks/MockERC20.sol';

contract ManagerTest is Test {
  Manager public manager;

  UniswapV3Pool uniPool = new UniswapV3Pool();
  UniswapV3Swap uniSwap = new UniswapV3Swap();

  MockERC20 usdc = new MockERC20('USD Coin', 'USDC');
  MockERC20 btc = new MockERC20('Bitcoin', 'BTC');
  MockERC20 eth = new MockERC20('Ethereum', 'ETH');

  function setUp() public {
    address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;
    bytes32 donID = 0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;
    string memory source = 'return Functions.encodeString("Hello, World!")';
    uint32 gasLimit = 300000;
    uint64 subID = 603;
    manager = new Manager(subID, router, donID, source, gasLimit);

    RiskEngine riskEngine = manager.riskEngine();
    riskEngine.addAsset('USDC-USD.CC', address(usdc));

    usdc.mint(address(this), 1000000 * 1e18);
    // TODO: Remove
    usdc.mint(address(manager), 1000000 * 1e18);

    usdc.approve(address(manager), 2 ** 256 - 1);

    MockERC20[] memory mints = new MockERC20[](2);
    mints[0] = eth;
    mints[1] = btc;
    for (uint256 i = 0; i < mints.length; i++) {
      address pool = uniPool.createPool(address(mints[i]), address(usdc), 3000);

      uint160 sqrtPriceX96 = 50 * 2 ** 96;
      IUniswapV3Pool(pool).initialize(sqrtPriceX96);

      UniswapV3Liquidity uniLiquidity = new UniswapV3Liquidity(
        address(mints[i]),
        address(usdc)
      );

      mints[i].mint(address(this), 1000000 * 1e18);

      mints[i].approve(address(uniLiquidity), 1000000 * 1e18);
      usdc.approve(address(uniLiquidity), 1000000 * 1e18);

      uniLiquidity.mintNewPosition(100000 * 1e18, 20000 * 1e18);
    }
  }

  function test() public {
    RiskEngine riskEngine = manager.riskEngine();
    riskEngine.addAsset('BTC-USD.CC', address(btc));
    riskEngine.addAsset('ETH-USD.CC', address(eth));

    string[] memory invalidAssets = new string[](3);
    invalidAssets[0] = 'BTC-USD.CC';
    invalidAssets[1] = 'ETH-USD.CC';
    invalidAssets[2] = 'FAKE-USD.CC';

    string[] memory assets = new string[](2);
    assets[0] = 'BTC-USD.CC';
    assets[1] = 'ETH-USD.CC';

    uint256 fee = 3000;
    string memory name = 'All Weather Fund';
    string memory symbol = 'uAWF';

    vm.expectRevert();
    manager.createETF(symbol, name, fee, invalidAssets);
    manager.createETF(symbol, name, fee, assets);

    address etf = manager.getETFAtIndex(0);
    (uint256 etfFee, uint256 created, uint256 updated) = manager.etfs(etf);
    assertEq(etfFee, fee);
    assertEq(created, block.number);
    assertEq(updated, block.number);

    string[] memory etfAssets = manager.getETFAssets(etf);
    console.log('--- Get ETF assets ---');
    console.log(etfAssets[0]);
    console.log(etfAssets[1]);
    assertEq(assets[0], etfAssets[0]);
    assertEq(assets[1], etfAssets[1]);

    uint256 etfsSize = manager.etfsSize();
    console.log('--- ETFs size ---');
    console.log(etfsSize);
    assertEq(etfsSize, 1);

    uint256[] memory etfWeights = riskEngine.getETFWeights(etf);
    console.log('--- Get ETF weights ---');
    console.log(etfWeights[0]);
    console.log(etfWeights[1]);
    assertEq(0, etfWeights[0]);
    assertEq(0, etfWeights[1]);

    uint256[] memory newETFWeights = new uint256[](2);
    newETFWeights[0] = 5000;
    newETFWeights[1] = 5000;
    riskEngine.setETFWeights(etf, newETFWeights);
    etfWeights = riskEngine.getETFWeights(etf);
    console.log('--- Set ETF weights ---');
    console.log(etfWeights[0]);
    console.log(etfWeights[1]);
    assertEq(5000, etfWeights[0]);
    assertEq(5000, etfWeights[1]);

    manager.deposit(0, 50);

    manager.withdraw(0, 50);
  }
}
