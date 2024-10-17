// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from 'forge-std/Test.sol';
import {console} from 'forge-std/console.sol';

import {UniswapV3Swap} from '../src/uniswap/UniswapV3Swap.sol';
import {UniswapV3Liquidity} from '../src/uniswap/UniswapV3Liquidity.sol';
import {UniswapV3Pool} from '../src/uniswap/UniswapV3Pool.sol';
import {UniswapV3Flash} from '../src/uniswap/UniswapV3Flash.sol';

import {IUniswapV3Pool} from '../src/uniswap/interfaces/IUniswapV3Pool.sol';
import {IUniswapV3Factory} from '../src/uniswap/interfaces/IUniswapV3Factory.sol';

import {MockERC20} from '../src/mocks/MockERC20.sol';

contract UniswapV3Test is Test {
  MockERC20 usdc = new MockERC20('USD Coin', 'USDC');
  MockERC20 weth = new MockERC20('Wrapped ETH', 'WETH');
  MockERC20 btc = new MockERC20('Bitcion', 'BTC');

  UniswapV3Pool private uniPool;
  UniswapV3Liquidity private uniLiquidity;
  UniswapV3Swap private uniSwap;
  UniswapV3Flash private uniFlash;

  uint24 poolFee = 3000;

  function setUp() public {
    uniPool = new UniswapV3Pool();
    uniLiquidity = new UniswapV3Liquidity(address(usdc), address(weth));
    uniSwap = new UniswapV3Swap();
    uniFlash = new UniswapV3Flash(address(usdc), address(weth), poolFee);

    weth.mint(address(this), 1000000 * 1e18);
    usdc.mint(address(this), 1000000 * 1e18);
  }

  function test() public {
    uint128 liquidity;
    address pool = uniPool.createPool(address(weth), address(usdc), poolFee);

    uint160 sqrtPriceX96 = 50 * 2 ** 96;
    IUniswapV3Pool(pool).initialize(sqrtPriceX96);
    console.log('--- Create and initialize pool ---');
    console.log('pool', pool);

    weth.approve(address(uniLiquidity), 1000000 * 1e18);
    usdc.approve(address(uniLiquidity), 1000000 * 1e18);
    (
      uint tokenId,
      uint128 liquidityDelta,
      uint amount0,
      uint amount1
    ) = uniLiquidity.mintNewPosition(10000 * 1e18, 20000 * 1e18);
    liquidity += liquidityDelta;
    console.log('--- Mint new position ---');
    console.log('token id', tokenId);
    console.log('liquidity', liquidity);
    console.log('amount 0', amount0);
    console.log('amount 1', amount1);

    (uint fee0, uint fee1) = uniLiquidity.collectAllFees(tokenId);
    console.log('--- Collect all fees ---');
    console.log('fee 0', fee0);
    console.log('fee 1', fee1);

    uint usdcAmountToAdd = 5 * 1e18;
    uint wethAmountToAdd = 15 * 1e18;

    (liquidityDelta, amount0, amount1) = uniLiquidity
      .increaseLiquidityCurrentRange(tokenId, usdcAmountToAdd, wethAmountToAdd);
    liquidity += liquidityDelta;
    console.log('--- Increase liquidity ---');
    console.log('liquidity', liquidity);
    console.log('amount 0', amount0);
    console.log('amount 1', amount1);

    uint amountIn = 1e18;
    weth.approve(address(uniSwap), amountIn);
    weth.approve(address(this), amountIn);
    uint amountOut = uniSwap.swapExactInputSingleHop(
      address(weth),
      address(usdc),
      poolFee,
      amountIn
    );
    console.log('--- Swap exact input single hop ---');
    console.log('amountIn', amountIn);
    console.log('amountOut', amountOut);

    uint balBefore = weth.balanceOf(address(this));
    weth.approve(address(uniFlash), 100 * 1e18);
    uniFlash.flash(0, 10 * 1e18);
    uint balAfter = weth.balanceOf(address(this));
    uint fee = balBefore - balAfter;
    console.log('balance before', balBefore);
    console.log('balance after', balAfter);
    console.log('WETH fee', fee);

    //bytes memory path = abi.encodePacked(
    //  address(weth),
    //  uint24(3000),
    //  address(usdc),
    //  uint24(100),
    //  address(usdc)
    //);
    //uint amountOut = uniSwap.swapExactInputMultiHop(path, WETH, 1e18);
    //console.log('--- Swap exact input multi hop ---');
    //console.log('amountOut', amountOut);

    (amount0, amount1) = uniLiquidity.decreaseLiquidityCurrentRange(
      tokenId,
      liquidity
    );
    console.log('--- Decrease liquidity ---');
    console.log('amount 0', amount0);
    console.log('amount 1', amount1);
  }
}
