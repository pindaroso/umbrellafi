// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ISwapRouter} from './interfaces/ISwapRouter.sol';
import {IERC20} from '../interfaces/IERC20.sol';

contract UniswapV3Swap {
  ISwapRouter constant router =
    ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  function swapExactInputSingleHop(
    address tokenIn,
    address tokenOut,
    uint24 poolFee,
    uint amountIn
  ) external returns (uint amountOut) {
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    IERC20(tokenIn).approve(address(router), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
      .ExactInputSingleParams({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: poolFee,
        recipient: msg.sender,
        deadline: block.timestamp,
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

    amountOut = router.exactInputSingle(params);
  }

  function swapExactInputMultiHop(
    bytes calldata path,
    address tokenIn,
    uint amountIn
  ) external returns (uint amountOut) {
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    IERC20(tokenIn).approve(address(router), amountIn);

    ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
      path: path,
      recipient: msg.sender,
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0
    });
    amountOut = router.exactInput(params);
  }
}
