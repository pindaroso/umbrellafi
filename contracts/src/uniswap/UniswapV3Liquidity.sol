// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from '../interfaces/IERC20.sol';
import {IERC20Wrapper} from '../interfaces/IERC20Wrapper.sol';
import {INonfungiblePositionManager} from './interfaces/INonfungiblePositionManager.sol';
import {IERC721Receiver} from '../interfaces/IERC721Receiver.sol';

contract UniswapV3Liquidity is IERC721Receiver {
  IERC20 private from;
  IERC20Wrapper private to;

  int24 private constant MIN_TICK = -887272;
  int24 private constant MAX_TICK = -MIN_TICK;
  int24 private constant TICK_SPACING = 60;

  constructor(address fromAddress, address toAddress) {
    from = IERC20(fromAddress);
    to = IERC20Wrapper(toAddress);
  }

  INonfungiblePositionManager public nonfungiblePositionManager =
    INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

  function onERC721Received(
    address operator,
    address fromAddress,
    uint tokenId,
    bytes calldata
  ) external pure returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
  }

  function mintNewPosition(
    uint amount0ToAdd,
    uint amount1ToAdd
  )
    external
    returns (uint tokenId, uint128 liquidity, uint amount0, uint amount1)
  {
    from.transferFrom(msg.sender, address(this), amount0ToAdd);
    to.transferFrom(msg.sender, address(this), amount1ToAdd);

    from.approve(address(nonfungiblePositionManager), amount0ToAdd);
    to.approve(address(nonfungiblePositionManager), amount1ToAdd);

    INonfungiblePositionManager.MintParams
      memory params = INonfungiblePositionManager.MintParams({
        token0: address(from),
        token1: address(to),
        fee: 3000,
        tickLower: (MIN_TICK / TICK_SPACING) * TICK_SPACING,
        tickUpper: (MAX_TICK / TICK_SPACING) * TICK_SPACING,
        amount0Desired: amount0ToAdd,
        amount1Desired: amount1ToAdd,
        amount0Min: 0,
        amount1Min: 0,
        recipient: address(this),
        deadline: block.timestamp
      });

    (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(
      params
    );

    if (amount0 < amount0ToAdd) {
      from.approve(address(nonfungiblePositionManager), 0);
      uint refund0 = amount0ToAdd - amount0;
      from.transfer(msg.sender, refund0);
    }
    if (amount1 < amount1ToAdd) {
      to.approve(address(nonfungiblePositionManager), 0);
      uint refund1 = amount1ToAdd - amount1;
      to.transfer(msg.sender, refund1);
    }
  }

  function collectAllFees(
    uint tokenId
  ) external returns (uint amount0, uint amount1) {
    INonfungiblePositionManager.CollectParams
      memory params = INonfungiblePositionManager.CollectParams({
        tokenId: tokenId,
        recipient: address(this),
        amount0Max: type(uint128).max,
        amount1Max: type(uint128).max
      });

    (amount0, amount1) = nonfungiblePositionManager.collect(params);
  }

  function increaseLiquidityCurrentRange(
    uint tokenId,
    uint amount0ToAdd,
    uint amount1ToAdd
  ) external returns (uint128 liquidity, uint amount0, uint amount1) {
    from.transferFrom(msg.sender, address(this), amount0ToAdd);
    to.transferFrom(msg.sender, address(this), amount1ToAdd);

    from.approve(address(nonfungiblePositionManager), amount0ToAdd);
    to.approve(address(nonfungiblePositionManager), amount1ToAdd);

    INonfungiblePositionManager.IncreaseLiquidityParams
      memory params = INonfungiblePositionManager.IncreaseLiquidityParams({
        tokenId: tokenId,
        amount0Desired: amount0ToAdd,
        amount1Desired: amount1ToAdd,
        amount0Min: 0,
        amount1Min: 0,
        deadline: block.timestamp
      });

    (liquidity, amount0, amount1) = nonfungiblePositionManager
      .increaseLiquidity(params);
  }

  function decreaseLiquidityCurrentRange(
    uint tokenId,
    uint128 liquidity
  ) external returns (uint amount0, uint amount1) {
    INonfungiblePositionManager.DecreaseLiquidityParams
      memory params = INonfungiblePositionManager.DecreaseLiquidityParams({
        tokenId: tokenId,
        liquidity: liquidity,
        amount0Min: 0,
        amount1Min: 0,
        deadline: block.timestamp
      });

    (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);
  }
}
