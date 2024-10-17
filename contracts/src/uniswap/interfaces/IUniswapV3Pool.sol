// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IUniswapV3Pool {
  function initialize(uint160 sqrtPriceX96) external;

  function flash(
    address recipient,
    uint amount0,
    uint amount1,
    bytes calldata data
  ) external;

  function swap(
    address recipient,
    bool zeroForOne,
    int amountSpecified,
    uint160 sqrtPriceLimitX96,
    bytes calldata data
  ) external returns (int amount0, int amount1);

  function slot0()
    external
    view
    returns (
      uint160 sqrtPriceX96,
      int24 tick,
      uint16 observationIndex,
      uint16 observationCardinality,
      uint16 observationCardinalityNext,
      uint8 feeProtocol,
      bool unlocked
    );
}
