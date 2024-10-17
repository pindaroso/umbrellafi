// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {NoDelegateCall} from './NoDelegateCall.sol';
import {IUniswapV3Factory} from './interfaces/IUniswapV3Factory.sol';

contract UniswapV3Pool is NoDelegateCall {
  IUniswapV3Factory public factory =
    IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);

  function createPool(
    address tokenA,
    address tokenB,
    uint24 fee
  ) external returns (address pool) {
    return factory.createPool(address(tokenA), address(tokenB), fee);
  }
}
